import os

if __name__ == '__main__':
    dir = '../res/images'
    images_gen_js = open("../js/images_gen.js", "w")
    output = "var images = [\n"
    for filename in os.listdir(dir):
        print(filename)
        output += "\t{\n"
        output += "\t\t\"title\": \"\",\n"
        output += "\t\t\"filename\": \"{0}\",\n".format(filename)
        output += "\t\t\"description\": \"\",\n"
        output += "\t\t\"mediagroup\": -1\n"
        output += "\t},\n"

    output = output[:-2] + "\n];" #remove trailing comma
    images_gen_js.write(output)
    images_gen_js.close()