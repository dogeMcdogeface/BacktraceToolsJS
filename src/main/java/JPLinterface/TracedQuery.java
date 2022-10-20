package JPLinterface;


import org.jpl7.Query;

import java.io.File;


public class TracedQuery extends Query {

    private File traceFile = null;

    public TracedQuery(String s) {
        super(s);
    }

    public final boolean hasMoreSolutionsT() {
        if (traceFile == null)
            traceFile = JPLinterface.startTrace();

        boolean a = super.hasMoreSolutions();
        if (a) {
            JPLinterface.updateTrace(traceFile);
        } else {
            JPLinterface.stopTrace(traceFile);
        }
        return a;
    }
}
