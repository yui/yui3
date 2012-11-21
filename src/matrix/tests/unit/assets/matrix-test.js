YUI.add('matrix-test', function (Y) {

var Assert = Y.Assert,
    Matrix   = Y.Matrix,
    Round = function(val)
    {
        return Math.round(val * 1000)/1000;
    }

    suite = new Y.Test.Suite('Matrix');

suite.add(new Y.Test.Case({
    name: 'MatrixUtil tests',

    testGet3x3Determinant: function() {
        var matrix = [
            [3, 2, 0],
            [0, 1, -2],
            [1, -3, -1]
        ],
        determinant = -25;

        Y.Assert.areEqual(Y.MatrixUtil.getDeterminant(matrix),  determinant, "The determinant should be: " + determinant + ".");
        matrix = [
            [-3, 2, 1],
            [2, 4, 0],
            [0, -7, 3]
        ];
        determinant = -62;

        Y.Assert.areEqual(Y.MatrixUtil.getDeterminant(matrix),  determinant, "The determinant should be: " + determinant + ".");

        matrix = [
            [1, 0, 2],
            [1, 2, 1],
            [2, 4, 0]
        ];
        determinant = -4;
        Y.Assert.areEqual(Y.MatrixUtil.getDeterminant(matrix),  determinant, "The determinant should be: " + determinant + ".");

        matrix = [
            [-3, -7, -3],
            [-1, 0, -1],
            [0, 0, -6]
        ];
        determinant = 42;
        Y.Assert.areEqual(Y.MatrixUtil.getDeterminant(matrix),  determinant, "The determinant should be: " + determinant + ".");
    },

    testGet4x4Determinant: function() {
        var matrix = [
            [2, 3, 1, 9],
            [1, 2, 0, 0],
            [0, 2, 4, 2],
            [1, 2, 4, 0]
        ],
        determinant = -80;
        Y.Assert.areEqual(Y.MatrixUtil.getDeterminant(matrix),  determinant, "The determinant should be: " + determinant + ".");
        
        matrix = [
            [-3, -5, 3, 4],
            [1, 2, 3, 2],
            [0, 1, -12, 1],
            [11, 3, 0, 3]
        ];
        determinant = 2349;
        Y.Assert.areEqual(Y.MatrixUtil.getDeterminant(matrix),  determinant, "The determinant should be: " + determinant + ".");

        matrix = [
            [1, -4, .5, -7],
            [1, 0, 3, 1],
            [3, 3, 3, 1],
            [1, 6, 3, 9]
        ];
        determinant = 6;
        Y.Assert.areEqual(Y.MatrixUtil.getDeterminant(matrix),  determinant, "The determinant should be: " + determinant + ".");

        matrix = [
            [14, 3, 11, -4],
            [-5, 9, 0, 3],
            [.2, 2, 0, 9],
            [1, 4, 6, 2]
        ];
        determinant = -4832.2;
        Y.Assert.areEqual(Y.MatrixUtil.getDeterminant(matrix),  determinant, "The determinant should be: " + determinant + ".");
    },

    testGet3x3Inverse: function()
    {
        var matrix = [
            [3, 2, 0],
            [0, 1, -2],
            [1, -3, -1]
        ],
        inverse = [
            [0.28, -0.08, 0.16],
            [0.08, 0.12, -0.24],
            [0.04, -0.44, -0.12]
        ],
        result = Y.MatrixUtil.inverse(matrix),
        i,
        j, 
        len = matrix.length;

        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [-3, 2, 1],
            [2, 4, 0],
            [0, -7, 3]
        ];
        inverse = [
            [-0.194, 0.21, 0.065],
            [0.097, 0.145, -0.032],
            [0.226, 0.339, 0.258]
        ];
        result = Y.MatrixUtil.inverse(matrix);

        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }

        matrix = [
            [1, 0, 2],
            [1, 2, 1],
            [2, 4, 0]
        ];
        inverse = [
            [1, -2, 1],
            [-0.5, 1, -0.25],
            [0, 1, -0.5]
        ];
        result = Y.MatrixUtil.inverse(matrix);

        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [-3, -7, -3],
            [-1, 0, -1],
            [0, 0, -6]
        ];
        inverse = [
            [0, -1, 0.167],
            [-0.143, 0.429, 0],
            [0, 0, -0.167]
        ];
        result = Y.MatrixUtil.inverse(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
    },

    test4x4Inverse: function() 
    {
        var matrix = [
            [2, 3, 1, 9],
            [1, 2, 0, 0],
            [0, 2, 4, 2],
            [1, 2, 4, 0]
        ],
        inverse = [
            [0.2, -0.25, -0.9, 0.85],
            [-0.1, 0.625, 0.45, -0.425],
            [0, -0.25, 0, 0.25],
            [0.1, -0.125, 0.05, -0.075] 
        ],
        len = matrix.length,
        i,
        j,
        result = Y.MatrixUtil.inverse(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [-3, -5, 3, 4],
            [1, 2, 3, 2],
            [0, 1, -12, 1],
            [11, 3, 0, 3]
        ];
        inverse = [
            [0, -0.138, -0.034, 0.103],
            [-0.111, 0.285, 0.043, -0.056],
            [0, 0.042, -0.073, -0.004],
            [0.111, 0.221, 0.083, 0.01]
        ];
        result = Y.MatrixUtil.inverse(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [1, -4, .5, -7],
            [1, 0, 3, 1],
            [3, 3, 3, 1],
            [1, 6, 3, 9]
        ];
        inverse = [
            [-12, 7.25, 5.5, -10.75],
            [8, -5.167, -3.333, 7.167],
            [6, -3.333, -2.667, 5.333],
            [-6, 3.75, 2.5, -5.25]
        ];
        result = Y.MatrixUtil.inverse(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [14, 3, 11, -4],
            [-5, 9, 0, 3],
            [.2, 2, 0, 9],
            [1, 4, 6, 2]
        ];
        inverse = [
            [0.093, 0.029, 0.07, -0.171],
            [0.057, 0.138, 0.002, -0.104],
            [-0.048, -0.086, -0.049, 0.255],
            [-0.015, -0.031, 0.109, 0.027]
        ];
        result = Y.MatrixUtil.inverse(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
    },

    test3x3Transpose: function()
    {
        var matrix = [
            [3, 2, 0],
            [0, 1, -2],
            [1, -3, -1]
        ],
        transpose = [
            [3, 0, 1],
            [2, 1, -3],
            [0, -2, -1]
        ],
        i,
        j,
        len = matrix.length,
        result = Y.MatrixUtil.transpose(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [-3, 2, 1],
            [2, 4, 0],
            [0, -7, 3]
        ];
        transpose = [
            [-3, 2, 0],
            [2, 4, -7],
            [1, 0, 3]
        ];
        result = Y.MatrixUtil.transpose(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [1, 0, 2],
            [1, 2, 1],
            [2, 4, 0]
        ];
        transpose = [
            [1, 1, 2],
            [0, 2, 4],
            [2, 1, 0]
        ];
        result = Y.MatrixUtil.transpose(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [-3, -7, -3],
            [-1, 0, -1],
            [0, 0, -6]
        ];
        transpose = [
            [-3, -1, 0],
            [-7, 0, 0],
            [-3, -1, -6]
        ];
        result = Y.MatrixUtil.transpose(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
    },

    test4x4Transpose: function()
    {
        var matrix = [
            [2, 3, 1, 9],
            [1, 2, 0, 0],
            [0, 2, 4, 2],
            [1, 2, 4, 0]
        ],
        transpose = [
            [2, 1, 0, 1],
            [3, 2, 2, 2],
            [1, 0, 4, 4],
            [9, 0, 2, 0]
        ],
        i,
        j,
        len = matrix.length,
        result = Y.MatrixUtil.transpose(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [-3, -5, 3, 4],
            [1, 2, 3, 2],
            [0, 1, -12, 1],
            [11, 3, 0, 3]
        ];
        transpose = [
            [-3, 1, 0, 11],
            [-5, 2, 1, 3],
            [3, 3, -12, 0],
            [4, 2, 1, 3]
        ];
        result = Y.MatrixUtil.transpose(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [1, -4, .5, -7],
            [1, 0, 3, 1],
            [3, 3, 3, 1],
            [1, 6, 3, 9]
        ];
        transpose = [
            [1, 1, 3, 1],
            [-4, 0, 3, 6],
            [.5, 3, 3, 3],
            [-7, 1, 1, 9]
        ];
        result = Y.MatrixUtil.transpose(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
        
        matrix = [
            [14, 3, 11, -4],
            [-5, 9, 0, 3],
            [.2, 2, 0, 9],
            [1, 4, 6, 2]
        ];
        transpose = [
            [14, -5, .2, 1],
            [3, 9, 2, 4],
            [11, 0, 0, 6],
            [-4, 3, 9, 2]
        ];
        result = Y.MatrixUtil.transpose(matrix);
        
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
    }
}));


suite.add(new Y.Test.Case({
    name: 'Matrix tests',

    testGetDeterminant: function() {
        determinant = 1,
        mymatrix = new Y.Matrix();
        mymatrix.rotate(45);
        /*
            [0.70711, -0.70711, 0]
            [0.70711, 0.70711, 0]
            [0, 0, 1]
        */
        Y.Assert.areEqual(Round(mymatrix.getDeterminant()),  determinant, "The determinant should be: " + determinant + ".");

        mymatrix.init();
        mymatrix.translate(15, 15);
        /*
            [1, 0, 15]
            [0, 1, 15]
            [0, 0, 1] 
         */
        
        Y.Assert.areEqual(Round(mymatrix.getDeterminant()),  determinant, "The determinant should be: " + determinant + ".");

        mymatrix.skewX(15);
        /*
            [1, 0.26795, 15]
            [0, 1, 15]
            [0, 0, 1] 
         */
        Y.Assert.areEqual(Round(mymatrix.getDeterminant()),  determinant, "The determinant should be: " + determinant + ".");

        mymatrix.scale(33, 11);
        /*
            [33, 2.9474500000000003, 15]
            [0, 11, 15]
            [0, 0, 1] 
         */
        determinant = 363;
        Y.Assert.areEqual(Round(mymatrix.getDeterminant()),  determinant, "The determinant should be: " + determinant + ".");
        
        mymatrix.skewY(67);
        /*
            [39.9437500825, 2.9474500000000003, 15]
            [25.914350000000002, 11, 15]
            [0, 0, 1]
         */
        Y.Assert.areEqual(Round(mymatrix.getDeterminant()),  determinant, "The determinant should be: " + determinant + ".");
    },

    testGetInverse: function() {
        var result,
        i, 
        j,
        inverse,
        len = 3,
        mymatrix = new Y.Matrix();
        mymatrix.rotate(45);
        /*
            [0.70711, -0.70711, 0]
            [0.70711, 0.70711, 0]
            [0, 0, 1]
        */
        //inverse test
        inverse = [
            [0.707, 0.707, 0.000],
            [-0.707, 0.707, 0.000],
            [0.000, 0.000, 1.000] 
        ];
        result = mymatrix.inverse();

        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }

        //clear and translate
        mymatrix.init();
        mymatrix.translate(15, 15);
        /*
            [1, 0, 15]
            [0, 1, 15]
            [0, 0, 1] 
         */
        //inverse test
        inverse = [
            [1.000, 0.000, -15.000],
            [0.000, 1.000, -15.000],
            [0.000, 0.000, 1.000]
        ];
        result = mymatrix.inverse();
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }

        //add a skewX
        mymatrix.skewX(15);
        /*
            [1, 0.26795, 15]
            [0, 1, 15]
            [0, 0, 1] 
         */
        //inverse test
        inverse = [
            [1.000, -0.268, -10.981],
            [0.000, 1.000, -15.000],
            [0.000, 0.000, 1.000]
        ];
        result = mymatrix.inverse();

        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
        
        //add a scale 
        mymatrix.scale(33, 11);
        /*
            [33, 2.9474500000000003, 15]
            [0, 11, 15]
            [0, 0, 1] 
         */
        //inverse test
        inverse = [
            [0.030, -0.008, -0.333],
            [0.000, 0.091, -1.364],
            [0.000, 0.000, 1.000] 
        ];
        
        result = mymatrix.inverse();

        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
       
        //add a skewY
        mymatrix.skewY(67);
        /*
            [39.9437500825, 2.9474500000000003, 15]
            [25.914350000000002, 11, 15]
            [0, 0, 1]
         */
        //inverse test
        inverse = [
            [0.030, -0.008, -0.333],
            [-0.071, 0.110, -0.580],
            [0.000, 0.000, 1.000] 
        ];
        
        result = mymatrix.inverse();

        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(inverse[i][j]), Round(result[i][j]), "The result of inverse" + (j + 1) + "," + (i +1) + " should be " + inverse[i][j] + ", not " + result[i][j]);
            }
        }
    },
    
    testGetTranspose: function() {
        var result,
        i, 
        j,
        transpose,
        len = 3,
        mymatrix = new Y.Matrix();
        mymatrix.rotate(45);
        /*
            [0.70711, -0.70711, 0]
            [0.70711, 0.70711, 0]
            [0, 0, 1]
        */
        
        transpose = [
            [0.707, 0.707, 0.000],
            [-0.707, 0.707, 0.000],
            [0.000, 0.000, 1.000]
        ];
        result = mymatrix.transpose();
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }

        //clear and translate
        mymatrix.init();
        mymatrix.translate(15, 15);
        /*
            [1, 0, 15]
            [0, 1, 15]
            [0, 0, 1] 
         */
        transpose = [
            [1.000, 0.000, 0.000],
            [0.000, 1.000, 0.000],
            [15.000, 15.000, 1.000]
        ];
        result = mymatrix.transpose();
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }

        //add a skewX
        mymatrix.skewX(15);
        /*
            [1, 0.26795, 15]
            [0, 1, 15]
            [0, 0, 1] 
         */
        transpose = [
            [1.000, 0.000, 0.000],
            [0.268, 1.000, 0.000],
            [15.000, 15.000, 1.000]
        ];
        result = mymatrix.transpose();
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }

        //add a scale 
        mymatrix.scale(33, 11);
        /*
            [33, 2.9474500000000003, 15]
            [0, 11, 15]
            [0, 0, 1] 
         */
        transpose = [
            [33.000, 0.000, 0.000],
            [2.947, 11.000, 0.000],
            [15.000, 15.000, 1.000]
        ];
        result = mymatrix.transpose();
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }

        //add a skewY
        mymatrix.skewY(67);
        /*
            [39.9437500825, 2.9474500000000003, 15]
            [25.914350000000002, 11, 15]
            [0, 0, 1]
         */
        transpose = [
            [39.944, 25.914, 0.000],
            [2.947, 11.000, 0.000],
            [15.000, 15.000, 1.000]
        ];
        result = mymatrix.transpose();
        for(i = 0; i < len; ++i)
        {
            for(j = 0; j < len; ++j)
            {
                 Y.Assert.areEqual(Round(transpose[i][j]), Round(result[i][j]), "The result of transpose" + (j + 1) + "," + (i +1) + " should be " + transpose[i][j] + ", not " + result[i][j]);
            }
        }
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires: ['test']});
