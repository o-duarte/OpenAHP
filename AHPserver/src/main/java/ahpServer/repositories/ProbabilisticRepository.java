package ahpServer.repositories;
import ahpServer.models.Probabilistic;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface ProbabilisticRepository extends MongoRepository<Probabilistic, String> {
    Probabilistic findBy_id(ObjectId _id);
}