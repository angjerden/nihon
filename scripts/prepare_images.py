from PIL import Image
import os

maxwidth = float(1920)
maxheight = float(1080)
maxwidth_thumb = float(356)
maxheight_thumb = float(200)

resized_suffix = "-resized"
thumb_suffix = "-thumb"

def rename_image(filename):
    filepath = dir + filename
    img = Image.open(filepath)
    exif_data = img._getexif()
    if exif_data is not None and 36867 in exif_data:  # The creation time
        creation_time = exif_data[36867].replace(':', '').replace(' ', '_')
        print("\tImage creation time is {0}".format(creation_time))
        if filename.startswith('P'): #Only rename filenames starting with P
            new_filename = creation_time + "-" + filename
            new_filepath = dir + new_filename
            print("\tRenaming {0} to {1}".format(filename, new_filename))
            os.rename(filepath, new_filepath)
            filename = new_filename
    return filename

def generate_images_js_entry(filename):
    output = "\t{\n"
    output += "\t\t\"title\": \"\",\n"
    output += "\t\t\"filename\": \"{0}\",\n".format(filename)
    output += "\t\t\"description\": \"\",\n"
    output += "\t\t\"mediagroup\": -1\n"
    output += "\t},\n"
    return output

def resize_img_and_make_thumbnail(filename):
    filepath = dir + filename
    filename_without_extension = os.path.splitext(filename)[0]
    new_filename = filename_without_extension + resized_suffix + ".jpg"
    new_filepath = dir + new_filename
    thumb_filename = filename_without_extension + thumb_suffix + ".jpg"
    thumb_filepath = dir + thumb_filename
    img = Image.open(filepath)
    height = float(img.size[0])
    width = float(img.size[1])

    ratio = min(maxwidth/width, maxheight/height)
    new_height = height * ratio
    new_width = width * ratio
    new_image_size = new_width, new_height

    print("\tMaking {0} with size {1}x{2}".format(new_filename, new_width, new_height))
    img.thumbnail(new_image_size, Image.ANTIALIAS)
    img.save(new_filepath, "JPEG")

    ratio_thumb = min(maxwidth_thumb/width, maxheight_thumb/height)
    thumb_height = height * ratio_thumb
    thumb_width = width * ratio_thumb
    thumb_size = thumb_width, thumb_height

    print("\tMaking thumbnail {0} with size {1}x{2}".format(thumb_filename, thumb_width, thumb_height))
    img.thumbnail(thumb_size, Image.ANTIALIAS)
    img.save(thumb_filepath, "JPEG")



if __name__ == '__main__':
    dir = '../res/images/'
    images_gen_js_file = open("../js/images_gen.js", "w")
    images_gen_js_string = "var images = [ \n"

    for filename in os.listdir(dir):
        if resized_suffix in filename or thumb_suffix in filename or \
            "jpg" not in filename.lower():
            continue
        print(filename)
        filename = rename_image(filename)
        images_gen_js_string += generate_images_js_entry(filename)
        resize_img_and_make_thumbnail(filename)

    images_gen_js_string = images_gen_js_string[:-2] + "\n];" # remove trailing comma
    images_gen_js_file.write(images_gen_js_string)
    images_gen_js_file.close()
