package JPLinterface;

import org.jpl7.JPL;
import org.jpl7.Query;
import org.jpl7.Term;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;


public class JPLinterface {

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

    public static void JPLinfo() {
        Term swi = Query.oneSolution("current_prolog_flag(version_data,Swi)").get("Swi");
        System.out.println("swipl.version = " + swi.arg(1) + "" + swi.arg(2) + "." + swi.arg(3));
        System.out.println("swipl.syntax = " + Query.oneSolution("jpl_pl_syntax(Syntax)").get("Syntax"));
        System.out.println("swipl.home = " + Query.oneSolution("current_prolog_flag(home,Home)").get("Home").name());
        System.out.println("jpl.jar = " + JPL.version_string());
        System.out.println("jpl.dll = " + org.jpl7.fli.Prolog.get_c_lib_version());
        System.out.println("jpl.pl = " + Query.oneSolution("jpl_pl_lib_version(V)").get("V").name());
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
        String consult = "consult('" + indProgramPath + "')";
        System.out.println(consult + " " + (Query.hasSolution(consult) ? "succeeded" : "failed"));
    }


    /***************************************************************
     *
     *
     ****************************************************************/
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

