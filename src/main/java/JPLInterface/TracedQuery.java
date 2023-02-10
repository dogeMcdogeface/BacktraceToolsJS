package JPLInterface;


import org.jpl7.Query;

import java.io.*;
import java.util.HashMap;
import java.util.Map;


public class TracedQuery extends Query {

    private File traceFile = null;

    public TracedQuery(String s) {
        super(s);
    }

    public final boolean hasMoreSolutionsT() {
        if (traceFile == null)
            traceFile = JPLInterface.startTrace();

        boolean a = super.hasMoreSolutions();
        if (a) {
            JPLInterface.updateTrace(traceFile);
        } else {
            JPLInterface.stopTrace(traceFile);
        }
        return a;
    }

    public Map<String, Object> parseTrace() {
        System.out.println("Parsing Trace: "+traceFile);
        if (traceFile == null) return null; //Se per qualche motivo il file che contiene la trace non esiste, skippa il metodo

        //Leggi il file "tracefile"


        Map<String, Object> hm_padri = new HashMap<>();
        //Parsa i contenuti in una lista
        hm_padri.put("test", "bloblbob");

        return hm_padri;
    }
}
