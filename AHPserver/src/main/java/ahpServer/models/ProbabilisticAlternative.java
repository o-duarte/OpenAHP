package ahpServer.models;


public class ProbabilisticAlternative {

  public double mean;
  public double median;
  public double q1;
  public double q2;
  public double q3;
  public int min;
  public int max;
  public String name;

  public ProbabilisticAlternative(double mean ,double median, double q1, double q2, double q3,
                        int min,   int max, String name) {
      this.name = name;
      this.mean = mean;
      this.median = median;
      this.q1 = q1;
      this.q2 = q2;
      this.q3 = q3;
      this.min = min;
      this.max = max;

  }

}
