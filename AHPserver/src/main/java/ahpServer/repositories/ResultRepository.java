package ahpServer.repositories;
import ahpServer.models.Result;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface ResultRepository extends MongoRepository<Result, String> {
    Result findBy_id(ObjectId _id);
}