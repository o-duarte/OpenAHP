package com.ahpServer.AHPserver;
import com.ahpServer.AHPserver.models.AhpProblem;
import com.ahpServer.AHPserver.repositories.AhpProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.bson.types.ObjectId;
import javax.validation.Valid;
import java.util.List;
@RestController
@RequestMapping("/aphproblem")
public class AhpProblemController {
  @Autowired
  private AhpProblemRepository repository;
 
  @RequestMapping(value = "/", method = RequestMethod.GET)
  public List<AhpProblem> getAllPets() {
    return repository.findAll();
  }
  @RequestMapping(value = "/{id}", method = RequestMethod.GET)
  public AhpProblem getPetById(@PathVariable("id") ObjectId id) {
    return repository.findBy_id(id);
  }
 
  @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
  public void modifyPetById(@PathVariable("id") ObjectId id, @Valid @RequestBody AhpProblem pets) {
    pets.set_id(id);
    repository.save(pets);
  }
 
  @RequestMapping(value = "/", method = RequestMethod.POST)
  public AhpProblem createPet(@Valid @RequestBody AhpProblem pets) {
    pets.set_id(ObjectId.get());
    repository.save(pets);
    return pets;
  }
 
  @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
  public void deletePet(@PathVariable ObjectId id) {
    repository.delete(repository.findBy_id(id));
  }
}