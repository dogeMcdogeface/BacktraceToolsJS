package JPLInterface;


import org.jpl7.Query;

import java.io.File;


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
}
