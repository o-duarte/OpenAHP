package ahpServer.models;

import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sensivities")
public class Sensivity {
  @Id
  public ObjectId _id;
  public String name;
  public String goal;
  public ArrayList<String> alternatives;
  public ArrayList<SensivityCriteria> criteria;
  public String raw;
  
  // Constructors
  public Sensivity() {

  }
 
  public Sensivity(ObjectId _id, 
                    String name, 
                    String goal, 
                    ArrayList<String> alternatives,
                    ArrayList<SensivityCriteria> criteria) {
    this._id = _id;
    this.name = name;
    this.goal = goal;
    this.alternatives = alternatives;
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