package ahpServer.models;

import java.util.ArrayList;

public class SensitivityCriteria {

  public String name;
  public ArrayList<SensitivityCriteria> subCriteria;
  public ArrayList<Double> weigths;
  public ArrayList<ArrayList<Double>> rankReversal;

}
