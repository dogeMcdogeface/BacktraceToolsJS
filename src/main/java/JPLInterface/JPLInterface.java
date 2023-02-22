package JPLInterface;

import org.jpl7.*;
import org.jpl7.fli.Prolog;


import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

public class JPLInterface {
    private static final ResourceBundle SERVER = ResourceBundle.getBundle("Server");

    static boolean forceTraceFile = true;     //Forces program to always save trace to out.txt. Used for debug purposes, leave false to use tmp file instead

    public static void init() {
        //Creates relevant folders, empties leftover files, starts engine with arguments...
        System.out.println("Starting JPL interface");
        String workingDir = System.getProperty("user.dir");
        System.out.println("Working dir: " + workingDir);

        // JPL.setTraditional();
        // Start Prolog engine with arguments...
        Query.hasSolution("use_module(library(jpl))"); // only because we call e.g. jpl_pl_syntax/1 below
    }


    //------    Execute incoming query                                  ------------------------------------//
    public static Map<String, Object> execute(String id, String program, String query, int count) throws IOException {
        System.out.println("Executing query with id: " + id);

        //Load program
        consultString(program);

        //Calculate solutions one by one
        List<Map<String, String>> solutions = new ArrayList<>();
        TracedQuery myQuery = new TracedQuery(query);
        while (myQuery.hasMoreSolutionsT() && solutions.size() < count) {
            Map<String, String> stringSolution = new HashMap<>();
            myQuery.nextSolution().forEach((key, value) -> stringSolution.put(key, value.toString()));
            solutions.add(stringSolution);
        }

        return Map.of(
                SERVER.getString("request.id"), id,
                SERVER.getString("request.query"), query,
                SERVER.getString("request.solutions"), solutions,
                SERVER.getString("request.trace"), myQuery.getTrace()
        );
    }

    //------    Load program to PROLOG engine                           ------------------------------------//
    private static void consultString(String program) throws IOException {
        System.out.println("Creating tmp program file");
        File programFile = saveTmp(program);
        System.out.println("Saved program to: " + programFile);


        String indProgramPath = programFile.toURI().getPath();
        String consult = String.format("consult('%s')", indProgramPath);
        System.out.println( "Loading program: " + consult);

        try {
            boolean success = Query.hasSolution(consult);
            System.out.println("   Success "+ success);
        }catch (JPLException e) {
            throw new IOException(e);
        }
    }

    private static File saveTmp(String txt) throws IOException {   //Saving to a tmp file with randomized name prevents conflict from running multiple instances of the program
        File tmpFile = File.createTempFile("BTR_pl_", ".tmp");
            FileWriter writer = new FileWriter(tmpFile);
            writer.write(txt);
            writer.close();
            return tmpFile;
    }

    public static File startTrace() {
        File traceFile = null;
        try {
            traceFile = saveTmp("");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
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
