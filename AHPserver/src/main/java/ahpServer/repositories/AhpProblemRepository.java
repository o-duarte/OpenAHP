package ahpServer.repositories;
import ahpServer.models.AhpProblem;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface AhpProblemRepository extends MongoRepository<AhpProblem, String> {
    AhpProblem findBy_id(ObjectId _id);
}