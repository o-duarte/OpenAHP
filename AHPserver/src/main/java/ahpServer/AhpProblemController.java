package ahpServer;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import ahpServer.models.AhpProblem;
import ahpServer.models.problemCriteria;
import ahpServer.models.Result;
import ahpServer.models.ResultCriteria;
import ahpServer.models.Sensitivity;
import ahpServer.models.SensitivityCriteria;
import ahpServer.repositories.AhpProblemRepository;
import ahpServer.repositories.ResultRepository;
import ahpServer.repositories.SensitivityRepository;


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
  @Autowired
  private SensitivityRepository sensitivityRepository;

  private DecisionProblem parentProblem;

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

  private ArrayList<ArrayList<Double>> matrix(Integer a){
    ArrayList<ArrayList<Double>> matrix = new ArrayList<ArrayList<Double>>();
    for(int i=0; i<a;i++){
      ArrayList<Double> row = new ArrayList<Double>();
      for(int j=0; j<a;j++){
        row.add(0d);
      }
      matrix.add(row);
    }
    return matrix;
  }

  private ResultCriteria getSubResults(DecisionElement subresult){
    ResultCriteria result = new ResultCriteria();
    result.name = subresult.getName();
    /////CHANGE NEXT LINE
    result.ranking = subresult.getRanking(FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
    result.subCriteria = new ArrayList<ResultCriteria>();
    for(int i=0;i<subresult.getSubcriteria().size();i++){
      result.subCriteria.add(getSubResults(subresult.getSubcriteria().get(i)));
    }
    return result;

  }

  private SensitivityCriteria getSubSensitivity(DecisionElement parent, 
                                            DecisionElement subSensitivity, 
                                            Integer alt,
                                            ArrayList<Double> parentWeight){
    SensitivityCriteria result = new SensitivityCriteria();
    result.name = subSensitivity.getName();
    result.weigths = parentWeight;
    result.subCriteria = new ArrayList<SensitivityCriteria>();
    NumercialSensitivityMethod sensitivityMethod = new NumercialSensitivityMethod(parentProblem, FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
    Boolean isLeaf = true;
    RankReversal x;
    //if(subSensitivity.getSubCriteriaCount() > 0){isLeaf = false;}
    for(int i = 0; i < parent.getSubCriteriaCount() ; i++ ){
      ArrayList<RankReversal> rank = sensitivityMethod.getRankReversals(parent, i);
      ArrayList<ArrayList<Double>> matrix = matrix(alt);
      for(int j = 0; j < rank.size(); j++ ){
        x = rank.get(j);
        matrix.get(x.getAlternative1()).set(x.getAlternative2(),x.getWeight());
      } 
      result.rankReversal = matrix;
    }
    for(int i = 0; i < subSensitivity.getSubCriteriaCount() ; i++ ){
      ArrayList<Double> subParentWeight = subSensitivity.getPriorityVector(FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
      result.subCriteria.add(getSubSensitivity(
                                          subSensitivity,
                                          subSensitivity.getSubcriteria().get(i),
                                          alt,
                                          subParentWeight ));
    }
    return result;

  }

  @RequestMapping(value = "/{id}", method = RequestMethod.GET)
  public AhpProblem getProblemById(@PathVariable("id") ObjectId id) {
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
      //System.out.println(toDecisionElement(problem.criteria.get(i)).getRanking(FactoryPriorityMethod.PriorityMethodEnum.REVISED_GEOMETRIC_MEAN));
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
    parentProblem = decisionProblem;
    
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
    

    ///sensitivity Analisis
    NumercialSensitivityMethod sensitivityMethod = new NumercialSensitivityMethod(
                                            decisionProblem,
                                            FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);


    //ArrayList<RankReversal> rank = sensitivityMethod.getRankReversals(decisionProblem.getRoot(), 2);
    RankReversal x;
    ArrayList<RankReversal> allrank = sensitivityMethod.getAllRankReversals();
    //System.out.println(allrank);
    System.out.println(allrank.size());
    System.out.println(decisionProblem.getRoot().getPriorityVector(FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM));
    
    Sensitivity sensitivity = new Sensitivity();
    sensitivity.set_id(ObjectId.get());
    sensitivity.name = problem.name;
    sensitivity.goal = problem.goal;
    sensitivity.alternatives = problem.alternatives;
    sensitivity.criteria = new ArrayList<SensitivityCriteria>();

    ArrayList<Double> parentWeight = decisionProblem.getRoot().getPriorityVector(FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
    decisionProblem.getAlternativesCount();

    for(int i = 0; i < decisionProblem.getRoot().getSubCriteriaCount() ; i++ ){
      /*
      SensitivityCriteria sensitivityCriteria = new SensitivityCriteria();
      sensitivityCriteria.name = decisionProblem.getRoot().getSubcriteria().get(i).getName();
      sensitivityCriteria.weigths = parentWeight;
      sensitivityCriteria.subCriteria = new ArrayList<SensitivityCriteria>();
      //System.out.println(decisionProblem.getRoot().getSubcriteria().get(i).getPrioritiesVectors());
      ArrayList<RankReversal> rank = sensitivityMethod.getRankReversals(decisionProblem.getRoot(), i);
      ArrayList<ArrayList<Double>> matrix = matrix(decisionProblem.getAlternativesCount());
      for(int j = 0; j < rank.size(); j++ ){
        x = rank.get(j);
        matrix.get(x.getAlternative1()).set(x.getAlternative2(),x.getWeight());
      }
      */
      sensitivity.criteria.add(getSubSensitivity(
                                          decisionProblem.getRoot(),
                                          decisionProblem.getRoot().getSubcriteria().get(i),
                                          decisionProblem.getAlternativesCount(),
                                          parentWeight ));
      //System.out.println(matrix);
      //sensitivityCriteria.rankReversal = matrix;
      //sensitivity.criteria.add(sensitivityCriteria);
    }
    if(repository.findBy_id(problem._id).sensitivity != null  ){
      sensitivityRepository.delete(sensitivityRepository.findBy_id(repository.findBy_id(problem._id).sensitivity));
    }
    sensitivity.raw= "";
    try {
        String json = mapper.writeValueAsString(sensitivity);
        sensitivity.raw = json;
    } catch (JsonProcessingException e) {
        e.printStackTrace();
    }
    problem.sensitivity = sensitivity._id;
    sensitivityRepository.save(sensitivity);
    repository.save(problem);
    resultRepository.save(result);  
    return problem;
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