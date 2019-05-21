package ahpServer.models;

import java.util.ArrayList;

public class ResultCriteria {

  public String name;
  public ArrayList<ResultCriteria> subCriteria;
  public ArrayList<Double> ranking;
  public Double weight;
  public Double consistency;
  public Double error;

}
