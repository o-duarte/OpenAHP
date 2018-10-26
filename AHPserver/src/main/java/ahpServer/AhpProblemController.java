package ahpServer;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import ahpServer.models.AhpProblem;
import ahpServer.models.problemCriteria;
import ahpServer.repositories.AhpProblemRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
    
    NumercialSensitivityMethod sensitivityMethod = new NumercialSensitivityMethod(
                                            decisionProblem,
                                            FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
    ArrayList<RankReversal> rank = sensitivityMethod.getRankReversals(decisionProblem.getRoot(), 2);
    
    //double delta = 1e-2;

    for(int i = 0; i < rank.size(); i++){
        System.out.println("weight----"+ rank.get(i).getWeight());
        System.out.println("a1----"+ rank.get(i).getAlternative1());
        System.out.println("a2----"+ rank.get(i).getAlternative2());
    }
    System.out.println("---------------------NORMALISED_COLUMN_SUM");
    System.out.println(decisionProblem.getRanking(FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM));
    System.out.println("---------------------EIGENVECTOR");
    System.out.println(decisionProblem.getRanking(FactoryPriorityMethod.PriorityMethodEnum.EIGENVECTOR));
    System.out.println("---------------------GEOMETRIC_MEAN");
    System.out.println(decisionProblem.getRanking(FactoryPriorityMethod.PriorityMethodEnum.GEOMETRIC_MEAN));
    System.out.println("---------------------REVISED_GEOMETRIC_MEAN");
    System.out.println(decisionProblem.getRanking(FactoryPriorityMethod.PriorityMethodEnum.REVISED_GEOMETRIC_MEAN));
    return repository.findBy_id(id);
  }
 
  @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
  public void modifyPetById(@PathVariable("id") ObjectId id, @Valid @RequestBody AhpProblem pets) {
    pets.set_id(id);
    repository.save(pets);
  }
 
  @RequestMapping(value = "/", method = RequestMethod.POST)
  public AhpProblem createPet(@Valid @RequestBody AhpProblem pets) {
    pets.set_id(ObjectId.get());
    repository.save(pets);
    return pets;
  }
 
  @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
  public void deletePet(@PathVariable ObjectId id) {
    repository.delete(repository.findBy_id(id));
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