package ahpServer.models;

import java.util.Date;
import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ahpproblems")
public class AhpProblem {
  @Id
  public ObjectId _id;
  public ObjectId owner;
  public String name;
  public String goal;
  public ArrayList<ArrayList<Double>> rootMatrix;
  public ArrayList<String> alternatives;
  public Integer priorityMethod;
  public Integer consistencyMethod;
  public Integer errorMeasure;
  public ArrayList<problemCriteria> criteria;
  public ObjectId result;
  public ObjectId sensitivity;


  @CreatedDate
  public Date createdAt;
  @LastModifiedDate
  public Date updatedAt;
  @LastModifiedDate
  public Date lastResolutionAt;
  
  // Constructors
  public AhpProblem() {

  }
 
  public AhpProblem(ObjectId _id, 
                    String name, 
                    String goal, 
                    ArrayList<String> alternatives,
                    Integer priorityMethod,
                    Integer errorMeasure,
                    Integer consistencyMethod,
                    ArrayList<problemCriteria> criteria,
                    ObjectId result) {
    this._id = _id;
    this.name = name;
    this.goal = goal;
    this.alternatives = alternatives;
    this.priorityMethod = priorityMethod;
    this.errorMeasure = errorMeasure;
    this.criteria = criteria;
    this.result = result;
  }
 
  // ObjectId needs to be converted to string
  public String get_id() { return _id.toHexString(); }
  public void set_id(ObjectId _id) { this._id = _id; }

  public String getowner() { return owner.toHexString(); }
  public String getresult() { return result.toHexString(); }
  public String getsensitivity() { return sensitivity.toHexString(); }
  public void set_owner(ObjectId owner) { this.owner = owner; }
 
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
 
  public String  getGoal() { return goal; }
  public void setGoal(String goal) { this.goal = goal; }
 
}