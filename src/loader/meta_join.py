#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sw=4 ts=4

try:
   import json as simplejson
except:
   import simplejson

import os, codecs, md5

class MetaJoin(object):

    def __init__(self):

        # SRC_DIR        = '/Users/adamoore/src/yui3/src/'
        SRC_DIR        = '../'
        SRC_SUBDIR     = 'meta'
        SRC_EXT        = 'json'

        TEMPLATE_DIR   = 'template'
        TEMPLATE_FILE  = 'meta.js'
        TEMPLATE_TOKEN = '{ /* METAGEN */ }' 

        DEST_DIR       = 'js'
        DEST_JSON      = 'yui3.json'
        DEST_JS        = 'yui3.js'

        MD5_TOKEN = '{ /* MD5 */ }' 

        TEST = 'test'
        CONDITION = 'condition'
        SUBMODULES = 'submodules'
        PLUGINS = 'plugins'

        src_path       = os.path.abspath(SRC_DIR)

        # print src_path

        template_path  = os.path.abspath(TEMPLATE_DIR)
        dest_path      = os.path.abspath(DEST_DIR)

        if not os.path.exists(dest_path):         
            os.mkdir(dest_path)

        # print dest_path

        def readFile(path, file):
            return codecs.open(os.path.join(path, file), "r", "utf-8").read()

        modules = {}
        fnreplacers = {}

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
                            # print simplejson.dumps(data, ensure_ascii=False, sort_keys=True, indent=4)
                            if data:
                                for k, v in data.iteritems():

                                    modules[k] = v

                                    print 'module: ' + k
                                    # print simplejson.dumps(v, ensure_ascii=False, sort_keys=True, indent=4)

                                    def get_test_fn(mod):
                                        # we are allowing function tests for conditional
                                        if CONDITION in mod:
                                            condition = mod[CONDITION]

                                            # print 'condition: ' + condition

                                            if TEST in condition:
                                                testfile = condition[TEST]
                                                # try:
                                                fnstr = readFile(metadir, testfile)
                                                fnstr = fnstr.strip()
                                                token = '"' + testfile + '"'
                                                # jsstr = jsstr.replace(token, fnstr)

                                                fnreplacers[token] = fnstr

                                                # except:
                                                    # print 'WARNING: could not read ' + testfile

                                        if SUBMODULES in mod:
                                            subs = mod[SUBMODULES]

                                            # print simplejson.dumps(subs, ensure_ascii=False, sort_keys=True, indent=4)

                                            for subk, sub in subs.iteritems():
                                                get_test_fn(sub)

                                        if PLUGINS in mod:
                                            plugs = mod[PLUGINS]
                                            for plugk, plug in plugs.iteritems():
                                                get_test_fn(plug)
                                            

                                    get_test_fn(v)




        jsonstr = simplejson.dumps(modules, ensure_ascii=False, sort_keys=True, indent=4)

        # print jsonstr

        jsstr = readFile(template_path, TEMPLATE_FILE)
        jsstr = jsstr.replace(TEMPLATE_TOKEN, jsonstr)

        m = md5.new()
        m.update(jsstr)
        sig = m.hexdigest()

        jsstr = jsstr.replace(MD5_TOKEN, sig)

        print simplejson.dumps(fnreplacers, ensure_ascii=False, sort_keys=True, indent=4)
        for k, v in fnreplacers.iteritems():
            jsstr = jsstr.replace(k, v)

        # write the raw module json
        out = codecs.open(os.path.join(dest_path, DEST_JSON), 'w', 'utf-8')
        out.writelines(jsonstr)
        out.close()

        # create the meta.js file from a template
        out = codecs.open(os.path.join(dest_path, DEST_JS), 'w', 'utf-8')
        out.writelines(jsstr)
        out.close()
            
        print 'done'

def main():
    metagen = MetaJoin()

if __name__ == '__main__':
    main()
