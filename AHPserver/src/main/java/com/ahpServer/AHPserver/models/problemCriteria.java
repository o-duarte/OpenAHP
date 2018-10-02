package com.ahpServer.AHPserver.models;

import java.util.ArrayList;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.query.Criteria;

public class problemCriteria {
  @Id
  public ObjectId _id;
  public String name;
  @DBRef
  public ArrayList<problemCriteria> subCriteria;
  public ArrayList<ArrayList<Double>> matrix;
  
  
  public String get_id() { return _id.toHexString(); }
  public void set_id(ObjectId _id) { this._id = _id; }
}
