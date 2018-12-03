package ahpServer.models;

import java.util.ArrayList;

public class SensivityCriteria {

  public String name;
  public ArrayList<SensivityCriteria> subCriteria;
  public ArrayList<Double> weigths;
  public ArrayList<ArrayList<Double>> rankReversal;

}
