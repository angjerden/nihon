from PIL import Image
from PIL import ExifTags
import os

maxwidth = float(1920)
maxheight = float(1080)
maxwidth_thumb = float(356)
maxheight_thumb = float(200)

resized_suffix = "-resized"
thumb_suffix = "-thumb"

def rename_image_with_timestamp(dir, filename):
    filepath = dir + filename
    img = Image.open(filepath)

    creation_time = get_creation_time(img)
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

def resize_img_and_make_thumbnail(dir, filename):
    filename_without_extension = os.path.splitext(filename)[0]
    #new_filename = filename_without_extension + resized_suffix + ".jpg"
    new_filename = filename #replacing with same filename
    generate_image_with_bounds(maxwidth, maxheight, filename, dir, new_filename)

    thumb_filename = filename_without_extension + thumb_suffix + ".jpg"
    #generate_image_with_bounds(maxwidth_thumb, maxheight_thumb, filename, dir, thumb_filename)

    return new_filename

def generate_image_with_bounds(maxwidth, maxheight, filename, dir, new_filename):
    filepath = dir + filename
    new_filepath = dir + new_filename

    img = Image.open(filepath)
    rotation = get_rotation(img)
    width = float(img.size[0])
    height = float(img.size[1])

    ratio = min(maxwidth/width, maxheight/height)
    new_height = height * ratio
    new_width = width * ratio
    new_image_size = new_width, new_height

    print("\tMaking {0} with size {1}x{2}".format(new_filename, new_width, new_height))
    if rotation is not None:
        print("\tRotating with {} degrees".format(rotation))
        img = img.rotate(rotation, expand=True)
    img.thumbnail(new_image_size, Image.ANTIALIAS)
    img.save(new_filepath, "JPEG")#, quality=95)

def get_creation_time(img):
    exif_data = img._getexif()
    if exif_data is not None:
        if 36867 in exif_data:  # The creation time
            return exif_data[36867].replace(':', '').replace(' ', '_')

def get_rotation(img):
    for orientation in ExifTags.TAGS.keys():
        if ExifTags.TAGS[orientation] == 'Orientation':
            break
    exif_data = img._getexif()
    if exif_data is not None:
        if orientation in exif_data:
            if exif_data[orientation] == 3:
                return 180
            elif exif_data[orientation] == 6:
                return 270
            elif exif_data[orientation] == 8:
                return 90

if __name__ == '__main__':
    dir = '../res/images/'
    images_gen_js_file = open("../js/images_gen.js", "w")
    images_gen_js_string = "var images = [ \n"

    for filename in os.listdir(dir):
        if resized_suffix in filename or thumb_suffix in filename or \
            "jpg" not in filename.lower() or "png" not in filename.lower():
            continue
        filename = rename_image_with_timestamp(dir, filename)

    filenames = os.listdir(dir)
    filenames.sort() #sorting to get alphanumerical order
    for filename in filenames:
        if resized_suffix in filename or thumb_suffix in filename or \
            "jpg" not in filename.lower() or "png" not in filename.lower():
            continue
        print("Resizing {}".format(filename))
        filename = resize_img_and_make_thumbnail(dir, filename)
        images_gen_js_string += generate_images_js_entry(filename)

    images_gen_js_string = images_gen_js_string[:-2] + "\n];" # remove trailing comma
    images_gen_js_file.write(images_gen_js_string)
    images_gen_js_file.close()
