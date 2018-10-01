package com.ahpServer.AHPserver.models;

import java.util.ArrayList;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.query.Criteria;

public class problemCriteria {
  @Id
  public ObjectId _id;
 
  public String name;
  public ArrayList<problemCriteria> subCriteria;

}
