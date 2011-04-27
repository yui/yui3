#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sw=4 ts=4

try:
    import json as simplejson
except:
    import simplejson

import os, sys, codecs, md5


class MetaJoin(object):

    def __init__(self):
        pathname = os.path.dirname(sys.argv[0])
        if pathname == '.':
            print "Do not run this script from here, use 'ant all' in the above directory"
            return

        SRC_DIR = '../'
        SRC_SUBDIR = 'meta'
        SRC_EXT = 'json'

        TEMPLATE_DIR = 'template'
        TEMPLATE_FILE = 'meta.js'
        TEMPLATE_TOKEN = '{ /* METAGEN */ }'

        TESTS_FILE = 'load-tests-template.js'
        TESTS_DEST = 'load-tests.js'
        TESTS_DEST_DIR = '../yui/js'

        DEST_DIR = 'js'
        DEST_JSON = 'yui3.json'
        DEST_JS = 'yui3.js'

        MD5_TOKEN = '{ /* MD5 */ }'

        TEST = 'test'
        CONDITION = 'condition'
        SUBMODULES = 'submodules'
        PLUGINS = 'plugins'

        src_path = os.path.abspath(SRC_DIR)

        template_path = os.path.abspath(TEMPLATE_DIR)
        dest_path = os.path.abspath(DEST_DIR)
        tests_dest_path = os.path.abspath(TESTS_DEST_DIR)

        if not os.path.exists(dest_path):
            os.mkdir(dest_path)

        if not os.path.exists(tests_dest_path):
            os.mkdir(tests_dest_path)

        def readFile(path, file):
            return codecs.open(os.path.join(path, file), "r", "utf-8").read()

        modules = {}
        fnreplacers = {}
        conditions = {}
        tokencount = 0

        def get_test_fn(mod, seed, name):
# we are allowing function tests for conditional
            if CONDITION in mod:

                condition = mod[CONDITION]

                condition['name'] = name

                # print 'condition: ' + condition

                # print '********************************************'
                # print name
                # print '********************************************'

                # token = '"' + testfile + '"'
                if TEST in condition:
                    token = condition[TEST]
                else:
                    token = unicode(seed)
                    seed += 1

                # conditions[token] = condition
                conditions[token] = simplejson.dumps(mod[CONDITION],
                ensure_ascii=False, sort_keys=True, indent=4)

                if TEST in condition:
                    testfile = condition[TEST]
                    fnstr = readFile(metadir, testfile)
                    fnstr = fnstr.strip()
                    fnreplacers[token] = fnstr

            if SUBMODULES in mod:
                subs = mod[SUBMODULES]

# print simplejson.dumps(subs, ensure_ascii=False, sort_keys=True, indent=4)

                for subk, sub in subs.iteritems():
                    get_test_fn(sub, seed, subk)

            if PLUGINS in mod:
                plugs = mod[PLUGINS]
                for plugk, plug in plugs.iteritems():
                    get_test_fn(plug, seed, plugk)

        for i in os.listdir(src_path):
            # module director
            dirname = os.path.join(src_path, i)
            # print dirname
            if os.path.isdir(dirname):
                # meta dir
                metadir = os.path.join(dirname, SRC_SUBDIR)
                if os.path.isdir(metadir):
                    for j in os.listdir(metadir):
                        # print j
                        # read all [component].json files
                        if j.endswith(SRC_EXT):
                            string_data = readFile(metadir, j)
                            try:
                                data = simplejson.loads(string_data)
                            except:
                                print 'WARNING: could not read ' + j
                            if data:
                                for k, v in data.iteritems():
                                    modules[k] = v
                                    print 'module: ' + k
                                    get_test_fn(v, 0, k)

        jsonstr = simplejson.dumps(modules,
        ensure_ascii=False, sort_keys=True, indent=4)

        # print jsonstr

        jsstr = readFile(template_path, TEMPLATE_FILE)
        jsstr = jsstr.replace(TEMPLATE_TOKEN, jsonstr)

        m = md5.new()
        m.update(jsstr)
        sig = m.hexdigest()

        jsstr = jsstr.replace(MD5_TOKEN, sig)

        capsfile = readFile(template_path, TESTS_FILE)
        count = 0
        testlines = []

        print simplejson.dumps(fnreplacers,
        ensure_ascii=False, sort_keys=True, indent=4)

        for k, v in conditions.iteritems():
# generate a unique id for the test.  Update the metadata to point to the
# correct function, and add the tests to the features submodule


            id = unicode(count)
            count += 1
            addstr = "add('load', '%s', %s);" % (id, v)

            if k in fnreplacers:
                # jsstr = jsstr.replace(k, id)
                jsstr = jsstr.replace('"' + k + '"', fnreplacers[k])
                addstr = addstr.replace('"' + k + '"', fnreplacers[k])

            testlines.append("// %s" % (k))
            testlines.append(addstr)

        capsfile += '\n'.join(testlines)

        print capsfile

        # write the raw module json
        out = codecs.open(os.path.join(dest_path, DEST_JSON), 'w', 'utf-8')
        out.writelines(jsonstr)
        out.close()

        # create the meta.js file from a template
        out = codecs.open(os.path.join(dest_path, DEST_JS), 'w', 'utf-8')
        out.writelines(jsstr)
        out.close()

        # the module metadata tests need to be deployed to the yui package
        out = codecs.open(os.path.join(
        tests_dest_path, TESTS_DEST), 'w', 'utf-8')
        out.writelines(capsfile)
        out.close()

        print 'done'


def main():
    metagen = MetaJoin()

if __name__ == '__main__':
    main()
