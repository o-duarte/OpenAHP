package com.ahpServer.AHPserver.models;

import java.util.ArrayList;
import com.ahpServer.AHPserver.models.problemCriteria;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.query.Criteria;

public class AhpProblem {
  @Id
  public ObjectId _id;
 
  public String name;
  public String goal;
  public ArrayList<String> alternatives;
  public ArrayList<Integer> priorityMethod;
  public ArrayList<Integer> consistencyMethod;
  public ArrayList<Integer> errorMeasure;
  @DBRef
  public ArrayList<problemCriteria> criteria;

  // Constructors
  public AhpProblem() {

  }
 
  public AhpProblem(ObjectId _id, 
                    String name, 
                    String goal, 
                    ArrayList<String> alternatives,
                    ArrayList<Integer> priorityMethod,
                    ArrayList<Integer> errorMeasure,
                    ArrayList<problemCriteria> criteria) {
    this._id = _id;
    this.name = name;
    this.goal = goal;
    this.alternatives = alternatives;
    this.priorityMethod = priorityMethod;
    this.errorMeasure = errorMeasure;
    this.criteria = criteria;
  }
 
  // ObjectId needs to be converted to string
  public String get_id() { return _id.toHexString(); }
  public void set_id(ObjectId _id) { this._id = _id; }
 
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
 
  public String  getGoal() { return goal; }
  public void setGoal(String goal) { this.goal = goal; }
 
  //public String getbreed() { return breed; }
  //public void setBreed(String breed) { this.breed = breed; }
}