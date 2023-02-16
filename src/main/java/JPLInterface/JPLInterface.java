package JPLInterface;

import org.jpl7.Query;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class JPLInterface {
    static boolean forceTraceFile = true;     //Forces program to always save trace to out.txt. Used for debug purposes, leave false to use tmp file instead

    public static void init() {
        //Creates relevant folders, empties leftover files, starts engine with arguments...
        System.out.println("init JPL interface");
        String workingDir = System.getProperty("user.dir");
        System.out.println("Working dir: " + workingDir);

        // JPL.setTraditional();
        // Start Prolog engine with arguments...
        Query.hasSolution("use_module(library(jpl))"); // only because we call e.g. jpl_pl_syntax/1 below
    }


    //------    Execute incoming query                                  ------------------------------------//
    public static Map<String, Object> execute(String id, String program, String query, int count) {
        System.out.println("Executing " + id);
        Map<String, Object> response = new HashMap<String, Object>();

        response.put("id", id);
        response.put("query", query);

        JPLInterface.consultString(program);

        TracedQuery myQuery = new TracedQuery(query); //"jealous(X,Y)"
        //System.out.println("each solution of " + myQuery);
        int sol = 0;
        while (myQuery.hasMoreSolutionsT() && sol < count) {
            String txt = myQuery.nextSolution().toString();
            response.put("sol" + sol++, txt);
            System.out.println(txt);
        }

        response.put("trace", myQuery.getTrace());

        return response;
    }

    //------    Load program to PROLOG engine                           ------------------------------------//
    public static void consultString(String program) {
        //Save program to tmp file
        File programFile = saveTmp(program);
        if (programFile != null) {
            System.out.println("Saved program to: " + programFile);
        } else {
            System.out.println("Error saving program");
            //TODO throw error
        }
        //Load program on Prolog
        String indProgramPath = programFile.getPath().replace("\\", "/");         //TODO: clean up converting windows\paths to generic/paths
        System.out.println("Loading program: " + indProgramPath);
        String consult = "consult('" + indProgramPath + "')";
        try {
            System.out.println(consult + " " + (Query.hasSolution(consult) ? "succeeded" : "failed"));
        } catch (Exception e) {
            System.err.println(e);
        }
    }

    private static File saveTmp(String txt) {   //Saving to a tmp file with randomized name prevents conflict from running multiple instances of the program
        try {
            File tmpFile = File.createTempFile("BTR_pl_", ".tmp");
            FileWriter writer = new FileWriter(tmpFile);
            writer.write(txt);
            writer.close();
            return tmpFile;
        } catch (IOException e) {
            //TODO throw new RuntimeException(e);
            return null;
        }
    }

    public static File startTrace() {
        File traceFile = saveTmp("");
        if (forceTraceFile) traceFile = new File("out.txt");
        String indPath = traceFile.getPath().replace("\\", "/");         //TODO: clean up converting windows\paths to generic/paths

        //Settings for trace stopping points, visibility, and logging
        Query q1 = new Query("""
                leash(-all),
                visible(+all),
                protocol('""" + indPath + """
                ')""");
        System.out.println(q1 + " " + (q1.hasSolution() ? "succeeded" : "failed"));

        //Starts trace
        q1 = new Query("trace");
        System.out.println(q1 + " " + (q1.hasSolution() ? "succeeded" : "failed"));

        return traceFile;
    }

    public static void updateTrace(File f) {
        String s = "protocola('" + f.getPath().replace("\\", "/") + "')";
        Query traceQuery = new Query(s);
        System.out.println(s + " " + (traceQuery.hasSolution() ? "succeeded" : "failed"));
        System.out.println("Saved trace to: " + f);
    }

    public static void stopTrace(File f) {
        Query traceQuery = new Query("nodebug,noprotocol");
        System.out.println(traceQuery + " " + (traceQuery.hasSolution() ? "succeeded" : "failed"));
        System.out.println("Saved trace to: " + f);
    }
}
