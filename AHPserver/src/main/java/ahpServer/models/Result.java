package ahpServer.models;

import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "results")
public class Result {
  @Id
  public ObjectId _id;
  public String name;
  public String goal;
  public ArrayList<String> alternatives;
  public Integer priorityMethod;
  public Integer consistencyMethod;
  public Integer errorMeasure;
  public ArrayList<Double> ranking;
  public ArrayList<ResultCriteria> criteria;
  
  // Constructors
  public Result() {

  }
 
  public Result(ObjectId _id, 
                    String name, 
                    String goal, 
                    ArrayList<String> alternatives,
                    Integer priorityMethod,
                    Integer errorMeasure,
                    Integer consistencyMethod,
                    ArrayList<Double> ranking,
                    ArrayList<ResultCriteria> criteria) {
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
 
}