cd bootstrap
make clean
make bootstrap-js

# Copy the files we are using
cd ../
rm -r less
rm -r js
rm -r fonts

cp -r bootstrap/less less
cp -r bootstrap/fonts fonts
cp -r bootstrap/bootstrap/js js

cd less
# Chamge imports
sed -e 's/\.less";/\.lessimport";/g' bootstrap.less > bootstrap.lessimport
rm bootstrap.less

# Rename files to .lessimport
for files in *.less
do
	mv "$files" "${files%.less}.lessimport"
done

# Setup package.js
echo "var files = [" > ../package.js
for files in *.lessimport
do
	echo "'less/$files'," >> ../package.js
done

# other files which should be added
cd ../

echo "'js/bootstrap.js',\n'fonts/glyphiconshalflings-regular.eot',\n'fonts/glyphiconshalflings-regular.otf',\n'fonts/glyphiconshalflings-regular.svg',\n'fonts/glyphiconshalflings-regular.ttf',\n'fonts/glyphiconshalflings-regular.woff'];\n" >> package.js

# Add the actual code
cat package_base.js >> package.js
