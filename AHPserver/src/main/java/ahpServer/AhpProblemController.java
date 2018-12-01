package ahpServer;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import ahpServer.models.AhpProblem;
import ahpServer.models.problemCriteria;
import ahpServer.models.Result;
import ahpServer.models.ResultCriteria;
import ahpServer.repositories.AhpProblemRepository;
import ahpServer.repositories.ResultRepository;


import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import clc.ComparisonMatrix;
import clc.DecisionElement;
import mss.consistency.FactoryConsistencyMethod;
import mss.errorMeasure.FactoryErrorMethod;
import mtd.priority.FactoryPriorityMethod;
import problem.DecisionProblem;
import problem.DecisionProblemSolver;
import sty.NumercialSensitivityMethod;
import sty.RankReversal;

import ahpServer.TestCreators;

@RestController
@RequestMapping("/ahp")
public class AhpProblemController {
  
  @Autowired
  private AhpProblemRepository repository;
  @Autowired
  private ResultRepository resultRepository;

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public List<AhpProblem> getAllPets() {
    return repository.findAll();
  }

  private DecisionElement toDecisionElement(problemCriteria criteria){
    DecisionElement element = new DecisionElement(criteria.name);
    int dimension = criteria.matrix.size();
    ComparisonMatrix comparisonMatrix = new ComparisonMatrix(dimension, true);
    for (int i = 0; i < dimension; i++){
      for (int j = 0; j < dimension; j++) {
         if (i < j) {
           comparisonMatrix.set(i,j,criteria.matrix.get(i).get(j));
         }
      }
    }
    element.setComparisonMatrix(comparisonMatrix);
    for(int i=0;i<criteria.subCriteria.size();i++){
      element.addSubCriterion(toDecisionElement(criteria.subCriteria.get(i)));
    }
    return element;
  }

  private ResultCriteria getSubResults(DecisionElement subresult){
    ResultCriteria result = new ResultCriteria();
    result.name = subresult.getName();
    result.ranking = subresult.getRanking(FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
    result.subCriteria = new ArrayList<ResultCriteria>();
    for(int i=0;i<subresult.getSubcriteria().size();i++){
      result.subCriteria.add(getSubResults(subresult.getSubcriteria().get(i)));
    }
    return result;

  }

  @RequestMapping(value = "/{id}", method = RequestMethod.GET)
  public Result getProblemById(@PathVariable("id") ObjectId id) {
    AhpProblem problem = repository.findBy_id(id);
    DecisionProblem decisionProblem =  new DecisionProblem(problem.name);
    DecisionProblemSolver decisionSolver = new DecisionProblemSolver();

    String[] strNames = new String[problem.alternatives.size()];
    strNames = problem.alternatives.toArray(strNames);
    decisionProblem.setAlternatives(strNames);

    DecisionElement decisionElement = new DecisionElement(problem.goal);
    
    /* Root matrix */
    int dimension = problem.criteria.size();
    ComparisonMatrix comparisonMatrix = new ComparisonMatrix(dimension, true);
    for (int i = 0; i < dimension; i++){
      for (int j = 0; j < dimension; j++) {
         if (i < j) {
           comparisonMatrix.set(i,j,problem.rootMatrix.get(i).get(j));
         }
      }
    }
    decisionElement.setComparisonMatrix(comparisonMatrix);
    decisionProblem.setRootNode(decisionElement);

    /* Criteria */
    for(int i=0;i<problem.criteria.size();i++){
      System.out.println(toDecisionElement(problem.criteria.get(i)).getRanking(FactoryPriorityMethod.PriorityMethodEnum.REVISED_GEOMETRIC_MEAN));
      decisionProblem.addSubCriterion(toDecisionElement(problem.criteria.get(i)));
    }

    /* Solver */
    for(FactoryPriorityMethod.PriorityMethodEnum enume:
                FactoryPriorityMethod.PriorityMethodEnum.values()){
            decisionSolver.addPriorityMethod(enume);
    }
    for(FactoryConsistencyMethod.ConsistencyMethodEnum enume:
            FactoryConsistencyMethod.ConsistencyMethodEnum.values()){
        decisionSolver.addConsistencyMethod(enume);
    }
    for(FactoryErrorMethod.ErrorMethodEnum enume:
            FactoryErrorMethod.ErrorMethodEnum.values()){
        decisionSolver.addErrorMeasureMethod(enume);
    }

    decisionSolver.computeResults(decisionProblem, false);
    ///sensitivity Analisis
    NumercialSensitivityMethod sensitivityMethod = new NumercialSensitivityMethod(
                                            decisionProblem,
                                            FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
    ArrayList<RankReversal> rank = sensitivityMethod.getRankReversals(decisionProblem.getRoot(), 2);
    
    Result result = new Result();
    result.set_id(ObjectId.get());
    result.name = problem.name;
    result.goal = problem.goal;
    result.alternatives = problem.alternatives;
    result.priorityMethod = problem.priorityMethod ;
    result.consistencyMethod = problem.consistencyMethod;
    result.errorMeasure = problem.errorMeasure;
    result.criteria = new ArrayList<ResultCriteria>();
    /////////////////CHANGE NEXT LINE
    result.ranking = decisionProblem.getRanking(FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
    ArrayList<DecisionElement> criterias = decisionProblem.getRoot().getSubcriteria();
    for(int i=0;i<criterias.size();i++){
      result.criteria.add(getSubResults(criterias.get(i))); 
    }
    if(repository.findBy_id(problem._id).result != null  ){
      resultRepository.delete(resultRepository.findBy_id(repository.findBy_id(problem._id).result));
    }
    result.raw= "";
    ObjectMapper mapper = new ObjectMapper();
    try {
        String json = mapper.writeValueAsString(result);
        result.raw = json;
    } catch (JsonProcessingException e) {
        e.printStackTrace();
    }

    problem.result = result._id;
    repository.save(problem);
    resultRepository.save(result);

    for(int i = 0; i < rank.size(); i++){
        System.out.println("weight----"+ rank.get(i).getWeight());
        System.out.println("a1----"+ rank.get(i).getAlternative1());
        System.out.println("a2----"+ rank.get(i).getAlternative2());
    }


    return result;
  }
 
  @RequestMapping(value = "/new1", method= RequestMethod.GET)
  public void newtest1(){
    TestCreators test = new TestCreators();
    test.problem1();
    repository.save(test.problem);
  }
  @RequestMapping(value = "/new2", method= RequestMethod.GET)
  public void newtest2(){
    TestCreators test = new TestCreators();
    test.problem2();
    repository.save(test.problem);
 

  }

}