package ahpServer.models;

import java.util.ArrayList;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "criteria")
public class problemCriteria {

  public String name;
  public ArrayList<problemCriteria> subCriteria;
  public ArrayList<ArrayList<Double>> matrix;
  

}
