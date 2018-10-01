package com.ahpServer.AHPserver.models;

import java.util.ArrayList;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.query.Criteria;

public class comparisonMatrix {
  @Id
  public ObjectId _id;
 
  public String name;
  public String fullName;
  public ArrayList<ArrayList<Double>> matrix;

}
