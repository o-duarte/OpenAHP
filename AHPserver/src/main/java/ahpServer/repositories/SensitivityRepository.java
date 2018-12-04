package ahpServer.repositories;

import ahpServer.models.Sensitivity;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface SensitivityRepository extends MongoRepository<Sensitivity, String> {
    Sensitivity findBy_id(ObjectId _id);
}