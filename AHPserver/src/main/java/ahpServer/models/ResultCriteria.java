package ahpServer.models;

import java.util.ArrayList;
import org.springframework.data.mongodb.core.mapping.Document;

public class ResultCriteria {

  public String name;
  public ArrayList<ResultCriteria> subCriteria;
  public ArrayList<Double> ranking;

}
