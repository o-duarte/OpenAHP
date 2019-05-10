package ahpServer;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import ahpServer.models.AhpProblem;
import ahpServer.models.problemCriteria;
import ahpServer.models.Result;
import ahpServer.models.Analisis;
import ahpServer.models.ResultCriteria;
import ahpServer.models.Sensitivity;
import ahpServer.models.SensitivityCriteria;
import ahpServer.models.Probabilistic;
import ahpServer.models.ProbabilisticAlternative;
import ahpServer.repositories.AhpProblemRepository;
import ahpServer.repositories.ResultRepository;
import ahpServer.repositories.SensitivityRepository;
import ahpServer.repositories.ProbabilisticRepository;

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
import mss.consistency.FactoryConsistencyMethod.ConsistencyMethodEnum;
import mss.errorMeasure.FactoryErrorMethod;
import mss.errorMeasure.FactoryErrorMethod.ErrorMethodEnum;
import mtd.priority.FactoryPriorityMethod.PriorityMethodEnum;
import mtd.priority.FactoryPriorityMethod;

import problem.DecisionProblem;
import problem.DecisionProblemSolver;
import sty.NumercialSensitivityMethod;
import sty.ProbabilisticSensitivityMethod;
import sty.ProbabilisticSensitivityMethod.Statistics;
import sty.AbstracSensitivityMethod;
import sty.RankReversal;
import sty.RandomGenerators.GammaRandomGenerator;

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
  @Autowired
  private ProbabilisticRepository probRepo;

  private DecisionProblem parentProblem;

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

  private ResultCriteria getSubResults(DecisionElement subresult,
                                       ErrorMethodEnum errorMethod, 
                                       PriorityMethodEnum priorityMethod,
                                       ConsistencyMethodEnum consistencyMethod ){
    ResultCriteria result = new ResultCriteria();
    result.name = subresult.getName();
    result.ranking = subresult.getRanking(priorityMethod);
    result.consistency = subresult.getConsistency(consistencyMethod, priorityMethod);
    result.error = subresult.getErrorMeasure(errorMethod, priorityMethod);
    result.subCriteria = new ArrayList<ResultCriteria>();
    for(int i=0;i<subresult.getSubcriteria().size();i++){
      result.subCriteria.add(getSubResults(subresult.getSubcriteria().get(i), errorMethod, priorityMethod, consistencyMethod));
    }
    return result;

  }

  private SensitivityCriteria getSubSensitivity(DecisionElement parent, 
                                            DecisionElement subSensitivity, 
                                            Integer alt,
                                            ArrayList<Double> parentWeight,
                                            PriorityMethodEnum priorityMethod,
                                            Integer method,
                                            Integer index ){
    SensitivityCriteria result = new SensitivityCriteria();
    result.name = subSensitivity.getName();
    result.weigths = parentWeight;
    result.subCriteria = new ArrayList<SensitivityCriteria>();
    NumercialSensitivityMethod sensitivityMethod = new NumercialSensitivityMethod(parentProblem, priorityMethod);
    RankReversal x;
    
    ArrayList<RankReversal> rank = sensitivityMethod.getRankReversals(parent, index);
    ArrayList<ArrayList<Double>> matrix = matrix(alt);
    for(int j = 0; j < rank.size(); j++ ){
      x = rank.get(j);
      matrix.get(x.getAlternative1()).set(x.getAlternative2(),x.getWeight());
    }
    result.rankReversal = matrix; 
    
    /* test new method
    sensitivityMethod.setCriterion(subSensitivity, 0);
    rank = sensitivityMethod.getRankReversals(parent, index);
    ///
    sensitivityMethod.setCriterion(subSensitivity, 0);
    ArrayList<RankReversal> allrank1 = sensitivityMethod.getRankReversals(parent, index);
    ArrayList<RankReversal> allrank2 = sensitivityMethod.getAllRankReversals();
    ArrayList<RankReversal> allrank3 = sensitivityMethod.getRankReversals();
    
    for(int j = 0; j < allrank2.size(); j++ ){
      x = allrank2.get(j);
      System.out.println( x.getDecisionElement().getName() );
      System.out.println(x.getAlternative1());
      System.out.println(x.getAlternative2());
      System.out.println(x.getWeight());
    }


    System.out.println("1----------------");
    System.out.println(rank.size());
    System.out.println("2----------------");
    System.out.println(allrank1.size());
    System.out.println("3----------------");
    System.out.println(allrank2.size());
    System.out.println("4----------------");
    System.out.println(allrank2.size());
    */
    ArrayList<Double> subParentWeight = subSensitivity.getPriorityVector(priorityMethod);
    for(int i = 0; i < subSensitivity.getSubCriteriaCount() ; i++ ){
     
      result.subCriteria.add(getSubSensitivity(
                                          subSensitivity,
                                          subSensitivity.getSubcriteria().get(i),
                                          alt,
                                          subParentWeight,
                                          priorityMethod,
                                          method, i));
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
      decisionProblem.addSubCriterion(toDecisionElement(problem.criteria.get(i)),false);
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

    PriorityMethodEnum priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM;
    switch(problem.priorityMethod){
      case 0:
        priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM;
      case 1:
        priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.EIGENVECTOR;
      case 2:
        priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.GEOMETRIC_MEAN;
      case 3:
        priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.REVISED_GEOMETRIC_MEAN;
    }
    ErrorMethodEnum errorMethod = FactoryErrorMethod.ErrorMethodEnum.PRIORITY_VIOLATION;
    switch(problem.priorityMethod){
      case 0:
        errorMethod = FactoryErrorMethod.ErrorMethodEnum.PRIORITY_VIOLATION;
      case 1:
        errorMethod = FactoryErrorMethod.ErrorMethodEnum.QUADRATIC_DEVIATION;
    }
    ConsistencyMethodEnum consistencyMethod = FactoryConsistencyMethod.ConsistencyMethodEnum.CONSISTENCY_INDEX;
    switch(problem.priorityMethod){
      case 0:
        consistencyMethod = FactoryConsistencyMethod.ConsistencyMethodEnum.CONSISTENCY_INDEX;
      case 1:
        consistencyMethod = FactoryConsistencyMethod.ConsistencyMethodEnum.CONSISTENCY_RATIO;
      case 2:
        consistencyMethod = FactoryConsistencyMethod.ConsistencyMethodEnum.DETERMINANT_INDEX;
      case 3:
        consistencyMethod = FactoryConsistencyMethod.ConsistencyMethodEnum.GEOMETRIC_INDEX;
    }

    
    Result result = new Result();
    result.set_id(ObjectId.get());
    result.name = problem.name;
    result.goal = problem.goal;
    result.alternatives = problem.alternatives;
    result.priorityMethod = problem.priorityMethod ;
    result.consistencyMethod = problem.consistencyMethod;
    result.errorMeasure = problem.errorMeasure;
    result.criteria = new ArrayList<ResultCriteria>();
    result.ranking = decisionProblem.getRanking(priorityMethod);
    result.consistency = decisionProblem.getRoot().getConsistency(consistencyMethod, priorityMethod);
    result.error = decisionProblem.getRoot().getErrorMeasure(errorMethod, priorityMethod);
    ArrayList<DecisionElement> criterias = decisionProblem.getRoot().getSubcriteria();
    for(int i=0;i<criterias.size();i++){
      result.criteria.add(getSubResults(criterias.get(i), errorMethod, priorityMethod, consistencyMethod)); 
    }
    if(repository.findBy_id(problem._id).result != null  ){
      resultRepository.delete(resultRepository.findBy_id(repository.findBy_id(problem._id).result));
    }
    result.raw= "";
    ObjectMapper mapper = new ObjectMapper();
    try {
        String json = mapper.writeValueAsString(result);
        result.raw = json;
    } 
    catch (JsonProcessingException e) {
        e.printStackTrace();
    }

    problem.result = result._id;
    resultRepository.save(result);    

    ///sensitivity Analisis Rank Reversals
    Sensitivity sensitivity = new Sensitivity();
    sensitivity.set_id(ObjectId.get());
    sensitivity.name = problem.name;
    sensitivity.goal = problem.goal;
    sensitivity.alternatives = problem.alternatives;
    sensitivity.criteria = new ArrayList<SensitivityCriteria>();

    ArrayList<Double> parentWeight = decisionProblem.getRoot().getPriorityVector(priorityMethod);
    decisionProblem.getAlternativesCount();

    for(int i = 0; i < decisionProblem.getRoot().getSubCriteriaCount() ; i++ ){
      sensitivity.criteria.add(getSubSensitivity(
                                          decisionProblem.getRoot(),
                                          decisionProblem.getRoot().getSubcriteria().get(i),
                                          decisionProblem.getAlternativesCount(),
                                          parentWeight,
                                          priorityMethod,
                                          problem.sensitivityMethod, i ));
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
   
    

    ///sensitivity Analisis Probabilities

    Probabilistic probResult = new Probabilistic();
    probResult.set_id(ObjectId.get());
    probResult.alternatives = new ArrayList<ProbabilisticAlternative>();

    ProbabilisticSensitivityMethod prob = new ProbabilisticSensitivityMethod(decisionProblem, FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
    prob.setPreserveRankOrder(true);
    prob.addAllSimulationNodes(false);
    if(problem.generator==1){
      prob.setRandomGenerator(new GammaRandomGenerator(problem.beta));
    }
    prob.setPreserveRankOrder(problem.preserveRank);

    ArrayList<Double> testse = prob.getRanking();
    ArrayList<Statistics> simulation = prob.simulate();
    for(int i=0; i<simulation.size();i++){
        probResult.alternatives.add(new ProbabilisticAlternative(
            simulation.get(i).getMean(),
            simulation.get(i).getMedian(),
            simulation.get(i).getQuartile1(),
            simulation.get(i).getQuartile2(),
            simulation.get(i).getQuartile3(),
            simulation.get(i).getMin(),
            simulation.get(i).getMax(),
            problem.alternatives.get(i)
        ));
    }
    if(repository.findBy_id(problem._id).probabilistic != null  ){
      probRepo.delete(probRepo.findBy_id(repository.findBy_id(problem._id).probabilistic));
    }
    probRepo.save(probResult);
    problem.probabilistic = probResult._id;
    
    repository.save(problem);

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
  @RequestMapping(value= "/analisis/{id}", method = RequestMethod.POST)
  public ArrayList<Double> makeAnalisis(@PathVariable("id") ObjectId id, @Valid @RequestBody Analisis analisis){
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
      decisionProblem.addSubCriterion(toDecisionElement(problem.criteria.get(i)),false);
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

    
    PriorityMethodEnum priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM;
    switch(problem.priorityMethod){
      case 0:
        priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM;
      case 1:
        priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.EIGENVECTOR;
      case 2:
        priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.GEOMETRIC_MEAN;
      case 3:
        priorityMethod = FactoryPriorityMethod.PriorityMethodEnum.REVISED_GEOMETRIC_MEAN;
    }

    /*first solve */ 
    decisionSolver.computeResults(decisionProblem, false);
    /*find decisionElement to change*/
    //decisionProblem.getRoot().getRanking();
    /*solve again */
    if(analisis.weights.size()==1){
      return decisionProblem.getRoot().getRanking(analisis.weights, priorityMethod);
    }
    //decisionProblem.getRanking(priorityMethod, analisis.weights);
    
    DecisionElement element = decisionProblem.getRoot();
    analisis.id.remove(0);
    for (Integer index : analisis.id){
      element = element.getSubCriterionByIndex(index);
    }

    return element.getRanking(analisis.weights, priorityMethod);
  } 

}