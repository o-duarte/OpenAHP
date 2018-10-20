package ahpServer;

import java.util.ArrayList;
import java.util.Arrays;

import org.bson.types.ObjectId;

import ahpServer.models.AhpProblem;
import ahpServer.models.problemCriteria;

public class TestCreators {
    public AhpProblem problem;
    public void problem1(){
        AhpProblem problem = new AhpProblem();
        problem.name = "test1";
        problem.set_id(ObjectId.get());
        problem.goal = "best city";
        //alternatives
        problem.alternatives = new ArrayList<String>(Arrays.asList("london","madrid","santiago"));
        //methods
        problem.consistencyMethod = new ArrayList<Integer>(Arrays.asList(0));
        problem.errorMeasure = new ArrayList<Integer>(Arrays.asList(0));
        problem.priorityMethod = new ArrayList<Integer>(Arrays.asList(0));
        //base matrix
        ArrayList<Double> a = new ArrayList<Double>(Arrays.asList(1d,0.5d,0.25d));
        ArrayList<Double> b = new ArrayList<Double>(Arrays.asList(0d,1d,0.5d));
        ArrayList<Double> c = new ArrayList<Double>(Arrays.asList(0d,0d,1d));
        problem.rootMatrix = new ArrayList<ArrayList<Double>>();
        problem.rootMatrix.add(a);problem.rootMatrix.add(b);problem.rootMatrix.add(c);
        //security criteria
        problemCriteria security = new problemCriteria();
        security.name = "security";
        security.subCriteria = new ArrayList<problemCriteria>();
        security.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a3 = new ArrayList<Double>(Arrays.asList(1d,1d,4d));
        ArrayList<Double> b3 = new ArrayList<Double>(Arrays.asList(0d,1d,4d));
        ArrayList<Double> c3 = new ArrayList<Double>(Arrays.asList(0d,0d,1d));
        security.matrix.add(a3);security.matrix.add(b3);security.matrix.add(c3);;
        //health criteria
        problemCriteria health = new problemCriteria();
        health.name = "health";
        health.subCriteria = new ArrayList<problemCriteria>();
        health.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a1 = new ArrayList<Double>(Arrays.asList(1d,2d,6d));
        ArrayList<Double> b1 = new ArrayList<Double>(Arrays.asList(0d,1d,3d));
        ArrayList<Double> c1 = new ArrayList<Double>(Arrays.asList(0d,0d,1d));
        health.matrix.add(a1);health.matrix.add(b1);health.matrix.add(c1);;
        //health criteria
        problemCriteria transport = new problemCriteria();
        transport.name = "transport";
        transport.subCriteria = new ArrayList<problemCriteria>();
        transport.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a2 = new ArrayList<Double>(Arrays.asList(1d,0.5d,1d/8));
        ArrayList<Double> b2 = new ArrayList<Double>(Arrays.asList(0d,1d,0.25d));
        ArrayList<Double> c2 = new ArrayList<Double>(Arrays.asList(0d,0d,1d));
        transport.matrix.add(a2);transport.matrix.add(b2);transport.matrix.add(c2);
        //add criterias
        problem.criteria = new ArrayList<problemCriteria>();
        problem.criteria.add(security);
        problem.criteria.add(health);
        problem.criteria.add(transport);
        this.problem = problem;
        }

    public void problem2(){
        AhpProblem problem = new AhpProblem();
        problem.name = "test1";
        problem.set_id(ObjectId.get());
        problem.goal = "best car";
        //alternatives
        problem.alternatives = new ArrayList<String>(Arrays.asList("grand am","nissan","mercedes","volvo","thunder"));
        //methods
        problem.consistencyMethod = new ArrayList<Integer>(Arrays.asList(0));
        problem.errorMeasure = new ArrayList<Integer>(Arrays.asList(0));
        problem.priorityMethod = new ArrayList<Integer>(Arrays.asList(0));
        //base matrix
        ArrayList<Double> a = new ArrayList<Double>(Arrays.asList(1d,1/3d,2d,1/4d));
        ArrayList<Double> b = new ArrayList<Double>(Arrays.asList(0d,1d,3d,0.5d));
        ArrayList<Double> c = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1/4d));
        ArrayList<Double> d = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d));
        problem.rootMatrix = new ArrayList<ArrayList<Double>>();
        problem.rootMatrix.add(a);problem.rootMatrix.add(b);problem.rootMatrix.add(c);problem.rootMatrix.add(d);
        //driving criteria
        problemCriteria driving = new problemCriteria();
        driving.name = "driving";
        driving.subCriteria = new ArrayList<problemCriteria>();
        driving.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a3 = new ArrayList<Double>(Arrays.asList(1d,1/5d,1/5d,1/5d,1d));
        ArrayList<Double> b3 = new ArrayList<Double>(Arrays.asList(0d,1d,2d,1d,5d));
        ArrayList<Double> c3 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1/2d,4d));
        ArrayList<Double> d3 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,5d));
        ArrayList<Double> e3 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        driving.matrix.add(a3);driving.matrix.add(b3);driving.matrix.add(c3);driving.matrix.add(d3);driving.matrix.add(e3);;
        //interior criteria
        problemCriteria interior = new problemCriteria();
        interior.name = "interior";
        interior.subCriteria = new ArrayList<problemCriteria>();
        interior.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a1 = new ArrayList<Double>(Arrays.asList(1d,1/8d,1/7d,1/8d,1/2d));
        ArrayList<Double> b1 = new ArrayList<Double>(Arrays.asList(0d,1d,2d,1d,5d));
        ArrayList<Double> c1 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1/2d,3d));
        ArrayList<Double> d1 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,6d));
        ArrayList<Double> e1 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        interior.matrix.add(a1);interior.matrix.add(b1);interior.matrix.add(c1);interior.matrix.add(d1);interior.matrix.add(e1);
        //exterior criteria
        problemCriteria exterior = new problemCriteria();
        exterior.name = "exterior";
        exterior.subCriteria = new ArrayList<problemCriteria>();
        exterior.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a4 = new ArrayList<Double>(Arrays.asList(1d,1/4d,1/8d,1/7d,2d));
        ArrayList<Double> b4 = new ArrayList<Double>(Arrays.asList(0d,1d,1/3d,1/2d,5d));
        ArrayList<Double> c4 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1d,8d));
        ArrayList<Double> d4 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,7d));
        ArrayList<Double> e4 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        exterior.matrix.add(a4);exterior.matrix.add(b4);exterior.matrix.add(c4);exterior.matrix.add(d4);exterior.matrix.add(e4);
        //preformance criteria
        problemCriteria performance = new problemCriteria();
        performance.name = "performance";
        performance.subCriteria = new ArrayList<problemCriteria>();
        performance.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a2 = new ArrayList<Double>(Arrays.asList(1d,1d,1/5d,1/4d,2d));
        ArrayList<Double> b2 = new ArrayList<Double>(Arrays.asList(0d,1d,1/2d,1/2d,2d));
        ArrayList<Double> c2 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1d,5d));
        ArrayList<Double> d2 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,4d));
        ArrayList<Double> e2 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        performance.matrix.add(a2);performance.matrix.add(b2);performance.matrix.add(c2);performance.matrix.add(d2);performance.matrix.add(e2);
        //breakdown criteria
        problemCriteria breakdown = new problemCriteria();
        breakdown.name = "breakdown";
        breakdown.subCriteria = new ArrayList<problemCriteria>();
        breakdown.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a5 = new ArrayList<Double>(Arrays.asList(1d,1/5d,1/6d,1/5d,1d));
        ArrayList<Double> b5 = new ArrayList<Double>(Arrays.asList(0d,1d,1d,1d,5d));
        ArrayList<Double> c5 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1d,6d));
        ArrayList<Double> d5 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,5d));
        ArrayList<Double> e5 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        breakdown.matrix.add(a5);breakdown.matrix.add(b5);breakdown.matrix.add(c5);breakdown.matrix.add(d5);breakdown.matrix.add(e5);
        //safety criteria
        problemCriteria safety = new problemCriteria();
        safety.name = "safety";
        safety.subCriteria = new ArrayList<problemCriteria>();
        safety.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a6 = new ArrayList<Double>(Arrays.asList(1d,3d,1/4d,1/4d,1d));
        ArrayList<Double> b6 = new ArrayList<Double>(Arrays.asList(0d,1d,1/5d,1/5d,1/2d));
        ArrayList<Double> c6 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1d,4d));
        ArrayList<Double> d6 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,4d));
        ArrayList<Double> e6 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        safety.matrix.add(a6);safety.matrix.add(b6);safety.matrix.add(c6);safety.matrix.add(d6);safety.matrix.add(e6);
        //presige criteria
        problemCriteria prestige = new problemCriteria();
        prestige.name = "prestige";
        prestige.subCriteria = new ArrayList<problemCriteria>();
        prestige.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a7 = new ArrayList<Double>(Arrays.asList(1d,1/2d,1/5d,1/5d,2d));
        ArrayList<Double> b7 = new ArrayList<Double>(Arrays.asList(0d,1d,1/4d,1/4d,4d));
        ArrayList<Double> c7 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,2d,6d));
        ArrayList<Double> d7 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,5d));
        ArrayList<Double> e7 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        prestige.matrix.add(a7);prestige.matrix.add(b7);prestige.matrix.add(c7);prestige.matrix.add(d7);prestige.matrix.add(e7);
        //service criteria
        problemCriteria service = new problemCriteria();
        service.name = "service";
        service.subCriteria = new ArrayList<problemCriteria>();
        service.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a8 = new ArrayList<Double>(Arrays.asList(1d,2d,4d,4d,1d));
        ArrayList<Double> b8 = new ArrayList<Double>(Arrays.asList(0d,1d,2d,2d,1/2d));
        ArrayList<Double> c8 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1d,1/4d));
        ArrayList<Double> d8 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,1/4d));
        ArrayList<Double> e8 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        service.matrix.add(a8);service.matrix.add(b8);service.matrix.add(c8);service.matrix.add(d8);service.matrix.add(e8);
        //fuel criteria
        problemCriteria fuel = new problemCriteria();
        fuel.name = "fuel";
        fuel.subCriteria = new ArrayList<problemCriteria>();
        fuel.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a9 = new ArrayList<Double>(Arrays.asList(1d,1/3d,1d,1/3d,1/2d));
        ArrayList<Double> b9 = new ArrayList<Double>(Arrays.asList(0d,1d,3d,2d,2d));
        ArrayList<Double> c9 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1/2d,1/3d));
        ArrayList<Double> d9 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,2d));
        ArrayList<Double> e9 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        fuel.matrix.add(a9);fuel.matrix.add(b9);fuel.matrix.add(c9);fuel.matrix.add(d9);fuel.matrix.add(e9);
        //warranty criteria
        problemCriteria warranty = new problemCriteria();
        warranty.name = "warranty";
        warranty.subCriteria = new ArrayList<problemCriteria>();
        warranty.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a10 = new ArrayList<Double>(Arrays.asList(1d,3d,3d,2d,1d));
        ArrayList<Double> b10 = new ArrayList<Double>(Arrays.asList(0d,1d,1d,1/2d,1/3d));
        ArrayList<Double> c10 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1/2d,1/3d));
        ArrayList<Double> d10 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,1/2d));
        ArrayList<Double> e10 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        warranty.matrix.add(a10);warranty.matrix.add(b10);warranty.matrix.add(c10);warranty.matrix.add(d10);warranty.matrix.add(e10);
        //insurance criteria
        problemCriteria insurance = new problemCriteria();
        insurance.name = "insurance";
        insurance.subCriteria = new ArrayList<problemCriteria>();
        insurance.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a11 = new ArrayList<Double>(Arrays.asList(1d,2d,5d,5d,1d));
        ArrayList<Double> b11 = new ArrayList<Double>(Arrays.asList(0d,1d,4d,4d,1/2d));
        ArrayList<Double> c11 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1/2d,1/5d));
        ArrayList<Double> d11 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,1/5d));
        ArrayList<Double> e11 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        insurance.matrix.add(a11);insurance.matrix.add(b11);insurance.matrix.add(c11);insurance.matrix.add(d11);insurance.matrix.add(e11);
        //cost criteria
        problemCriteria cost = new problemCriteria();
        cost.name = "cost";
        cost.subCriteria = new ArrayList<problemCriteria>();
        cost.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a12 = new ArrayList<Double>(Arrays.asList(1d,2d,6d,5d,1/2d));
        ArrayList<Double> b12 = new ArrayList<Double>(Arrays.asList(0d,1d,4d,3d,1/3d));
        ArrayList<Double> c12 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,1d,1/6d));
        ArrayList<Double> d12 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,1/5d));
        ArrayList<Double> e12 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        cost.matrix.add(a12);cost.matrix.add(b12);cost.matrix.add(c12);cost.matrix.add(d12);cost.matrix.add(e12);
        //desing criteria
        problemCriteria design = new problemCriteria();
        design.name = "desing";
        design.subCriteria = new ArrayList<problemCriteria>();
        design.subCriteria.add(exterior);
        design.subCriteria.add(interior);
        design.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a13 = new ArrayList<Double>(Arrays.asList(1d,1d));
        ArrayList<Double> b13 = new ArrayList<Double>(Arrays.asList(0d,1d));
        design.matrix.add(a13);design.matrix.add(b13);
        //quality criteria
        problemCriteria quality = new problemCriteria();
        quality.name = "quality";
        quality.subCriteria = new ArrayList<problemCriteria>();
        quality.subCriteria.add(safety);
        quality.subCriteria.add(breakdown);
        quality.subCriteria.add(performance);
        quality.subCriteria.add(design);
        quality.subCriteria.add(driving);
        quality.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a14 = new ArrayList<Double>(Arrays.asList(1d,4d,1/2d,5d,5d));
        ArrayList<Double> b14 = new ArrayList<Double>(Arrays.asList(0d,1d,1/4d,2d,2d));
        ArrayList<Double> c14 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,5d,5d));
        ArrayList<Double> d14 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d,1d));
        ArrayList<Double> e14 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,0d,1d));
        quality.matrix.add(a14);quality.matrix.add(b14);quality.matrix.add(c14);quality.matrix.add(d14);quality.matrix.add(e14);
        //maintenance criteria
        problemCriteria maintenance = new problemCriteria();
        maintenance.name = "maintenance";
        maintenance.subCriteria = new ArrayList<problemCriteria>();
        maintenance.subCriteria.add(insurance);
        maintenance.subCriteria.add(warranty);
        maintenance.subCriteria.add(fuel);
        maintenance.subCriteria.add(service);
        maintenance.matrix = new ArrayList<ArrayList<Double>>();
        ArrayList<Double> a15 = new ArrayList<Double>(Arrays.asList(1d,4d,2d,4d));
        ArrayList<Double> b15 = new ArrayList<Double>(Arrays.asList(0d,1d,1/3d,2d));
        ArrayList<Double> c15 = new ArrayList<Double>(Arrays.asList(0d,0d,1d,3d));
        ArrayList<Double> d15 = new ArrayList<Double>(Arrays.asList(0d,0d,0d,1d));
        maintenance.matrix.add(a15);maintenance.matrix.add(b15);maintenance.matrix.add(c15);maintenance.matrix.add(d15);
        //add criterias
        problem.criteria = new ArrayList<problemCriteria>();
        problem.criteria.add(cost);
        problem.criteria.add(maintenance);
        problem.criteria.add(prestige);
        problem.criteria.add(quality);
        this.problem = problem;
        }
}