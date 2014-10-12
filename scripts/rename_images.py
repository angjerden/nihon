from PIL import Image
import os

if __name__ == '__main__':
    dir = '../res/images/'
    for filename in os.listdir(dir):
        print(filename)
        img = Image.open(dir + filename)
        exif_data = img._getexif()
        print "\t" + str(exif_data)