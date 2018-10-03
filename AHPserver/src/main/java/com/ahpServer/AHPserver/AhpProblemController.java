package com.ahpServer.AHPserver;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import com.ahpServer.AHPserver.models.AhpProblem;
import com.ahpServer.AHPserver.repositories.AhpProblemRepository;

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

@RestController
@RequestMapping("/aphproblem")
public class AhpProblemController {
  private DecisionProblem problem;
  private DecisionProblemSolver solver;  
  
  @Autowired
  private AhpProblemRepository repository;

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public List<AhpProblem> getAllPets() {
    solver = new DecisionProblemSolver();

        for(FactoryPriorityMethod.PriorityMethodEnum enume:
                FactoryPriorityMethod.PriorityMethodEnum.values()){
            solver.addPriorityMethod(enume);
        }
    
        for(FactoryConsistencyMethod.ConsistencyMethodEnum enume:
                FactoryConsistencyMethod.ConsistencyMethodEnum.values()){
            solver.addConsistencyMethod(enume);
        }
    
        for(FactoryErrorMethod.ErrorMethodEnum enume:
                FactoryErrorMethod.ErrorMethodEnum.values()){
            solver.addErrorMeasureMethod(enume);
        }
        
        /* This example has been taken from thesis
        "DISEÑO E IMPLEMENTACIÓN DE UNA API AHP PARA LA TOMA DE DECISIONES CON MÚLTIPLES CRITERIOS"
        by Daniel Quinteros
        Results from Expert Choice*/
        
        problem = new DecisionProblem("Best city");
        String alternatives[] = {"London", "Madrid", "Santiago"};
        problem.setAlternatives(alternatives);
        
        String testName = "Top criterion";
        DecisionElement decisionElement = new DecisionElement(testName);
    
        /* Root matrix */
        int dimension = 3;
        ComparisonMatrix comparisonMatrix = new ComparisonMatrix(dimension, true);
        comparisonMatrix.set(0, 1, 1d/2);
        comparisonMatrix.set(0, 2, 1d/4);
        comparisonMatrix.set(1, 2, 1d/2);
        decisionElement.setComparisonMatrix(comparisonMatrix);
    
        problem.setRootNode(decisionElement);
        
        comparisonMatrix.set(0, 1, 1);
        comparisonMatrix.set(0, 2, 4);
        comparisonMatrix.set(1, 2, 4);
    
        String criterionC1 = "security";
        DecisionElement decisionElementC1 = new DecisionElement(criterionC1);
        decisionElementC1.setComparisonMatrix(comparisonMatrix);
    
        problem.addSubCriterion(decisionElementC1, false);
        
        comparisonMatrix.set(0, 1, 2);
        comparisonMatrix.set(0, 2, 6);
        comparisonMatrix.set(1, 2, 3);
    
        String criterionC2 = "health";
        DecisionElement decisionElementC2 = new DecisionElement(criterionC2);
        decisionElementC2.setComparisonMatrix(comparisonMatrix);
    
        problem.addSubCriterion(decisionElementC2);
        
        comparisonMatrix.set(0, 1, 1d/2);
        comparisonMatrix.set(0, 2, 1d/8);
        comparisonMatrix.set(1, 2, 1d/4);
    
        String criterionC3 = "transport";
        DecisionElement decisionElementC3 = new DecisionElement(criterionC3);
        decisionElementC3.setComparisonMatrix(comparisonMatrix);
    
        problem.addSubCriterion(decisionElementC3, false);
        
        solver.computeResults(problem, false);
    
        NumercialSensitivityMethod sensitivityMethod =
                new NumercialSensitivityMethod(problem,
                                               FactoryPriorityMethod.PriorityMethodEnum.NORMALISED_COLUMN_SUM);
        ArrayList<RankReversal> rank = sensitivityMethod.getRankReversals(problem.getRoot(), 2);
    
        
        double delta = 1e-2;
        double weightExpected[] = {0.68, 0.41, 0.30};
        double alternativeExpected[][] = {{0, 1},{0, 2}, {1, 2}};   

    return repository.findAll();
  }
  @RequestMapping(value = "/{id}", method = RequestMethod.GET)
  public AhpProblem getPetById(@PathVariable("id") ObjectId id) {
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
}