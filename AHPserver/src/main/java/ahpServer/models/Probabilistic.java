package ahpServer.models;

import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "probabilistics")
public class Probabilistic {
  @Id
  public ObjectId _id;
  public ArrayList<ProbabilisticAlternative> alternatives;

  // Constructors
  public Probabilistic() {

  }
 
  public Probabilistic(ObjectId _id, ArrayList<ProbabilisticAlternative> alternatives) {
    this._id = _id;
    this.alternatives = alternatives;
  }
  
  // ObjectId needs to be converted to string
  public String get_id() { return _id.toHexString(); }
  public void set_id(ObjectId _id) { this._id = _id; }

}