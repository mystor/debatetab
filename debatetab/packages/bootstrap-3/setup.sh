cd bootstrap

# Build the css and js
npm install
grunt

# Copy the files we are using
cd ../
rm -r less
rm -r js

cp -r bootstrap/less less
cp -r bootstrap/dist/js js

cd less

# Chamge imports in bootstrap.less to use .lessimport
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
echo "'js/bootstrap.js'];" >> package.js

# Add the actual code
cat package_base.js >> package.js
