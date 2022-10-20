package JPLexample;

import JPLinterface.JPLinterface;
import JPLinterface.TracedQuery;

import java.util.concurrent.TimeUnit;


public class JPLexample {
    public static void main(String[] args) {

        //Init class
        JPLinterface.init();
        //Prints info on Prolog Engine
        JPLinterface.JPLinfo();

        System.out.println();
        //Load sample program
        String myProgramString = samplePL.program;
        JPLinterface.consultString(myProgramString);

        System.out.println();
        //Print solutions to query
        TracedQuery myQuery = new TracedQuery(samplePL.query); //"jealous(X,Y)"
        System.out.println("each solution of " + myQuery);
        while (myQuery.hasMoreSolutions()) {
            System.out.println(myQuery.nextSolution());
        }

        System.out.println();
        //Rerun query and save trace to file
        TracedQuery myTraceQuery = new TracedQuery(samplePL.query);
        System.out.println("each solution of " + myTraceQuery);
        while (myTraceQuery.hasMoreSolutionsT()) {
            try {
                TimeUnit.SECONDS.sleep(0);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println(myTraceQuery.nextSolution());
        }
    }
}
