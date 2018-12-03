package ahpServer.repositories;

import ahpServer.models.Sensivity;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface SensivityRepository extends MongoRepository<Sensivity, String> {
    Sensivity findBy_id(ObjectId _id);
}