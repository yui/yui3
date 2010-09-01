#!/bin/sh

src=$HOME/dev/yui/yui3/src/slider/assets/skins
build=$HOME/dev/yui/yui3/build/slider/assets
skins=$build/skins

cp -R $src/sam-dark $skins/
cp -R $src/round $skins/
cp -R $src/round-dark $skins/
cp -R $src/capsule $skins/
cp -R $src/capsule-dark $skins/
cp -R $src/audio $skins/
cp -R $src/audio-light $skins/

#core
cp $build/slider-base-core.css $build/slider-core.css

#sam
cp $skins/sam/slider-base.css $skins/sam/slider.css

# sam-dark
cp $skins/sam-dark/slider-base-skin.css $skins/sam-dark/slider-skin.css
cat $build/slider-base-core.css $skins/sam-dark/slider-base-skin.css > $skins/sam-dark/slider-base.css
$HOME/bin/min $skins/sam-dark/slider-base.css
mv slider-base-min.css $skins/sam-dark/slider.css
cp $skins/sam-dark/slider.css $skins/sam-dark/slider-base.css

# round
cp $skins/round/slider-base-skin.css $skins/round/slider-skin.css
cat $build/slider-base-core.css $skins/round/slider-base-skin.css > $skins/round/slider-base.css
$HOME/bin/min $skins/round/slider-base.css
mv slider-base-min.css $skins/round/slider.css
cp $skins/round/slider.css $skins/round/slider-base.css

# round-dark
cp $skins/round-dark/slider-base-skin.css $skins/round-dark/slider-skin.css
cat $build/slider-base-core.css $skins/round-dark/slider-base-skin.css > $skins/round-dark/slider-base.css
$HOME/bin/min $skins/round-dark/slider-base.css
mv slider-base-min.css $skins/round-dark/slider.css
cp $skins/round-dark/slider.css $skins/round-dark/slider-base.css

# capsule
cp $skins/capsule/slider-base-skin.css $skins/capsule/slider-skin.css
cat $build/slider-base-core.css $skins/capsule/slider-base-skin.css > $skins/capsule/slider-base.css
$HOME/bin/min $skins/capsule/slider-base.css
mv slider-base-min.css $skins/capsule/slider.css
cp $skins/capsule/slider.css $skins/capsule/slider-base.css

# capsule-dark
cp $skins/capsule-dark/slider-base-skin.css $skins/capsule-dark/slider-skin.css
cat $build/slider-base-core.css $skins/capsule-dark/slider-base-skin.css > $skins/capsule-dark/slider-base.css
$HOME/bin/min $skins/capsule-dark/slider-base.css
mv slider-base-min.css $skins/capsule-dark/slider.css
cp $skins/capsule-dark/slider.css $skins/capsule-dark/slider-base.css

# audio
cp $skins/audio/slider-base-skin.css $skins/audio/slider-skin.css
cat $build/slider-base-core.css $skins/audio/slider-base-skin.css > $skins/audio/slider-base.css
$HOME/bin/min $skins/audio/slider-base.css
mv slider-base-min.css $skins/audio/slider.css
cp $skins/audio/slider.css $skins/audio/slider-base.css

# audio-light
cp $skins/audio-light/slider-base-skin.css $skins/audio-light/slider-skin.css
cat $build/slider-base-core.css $skins/audio-light/slider-base-skin.css > $skins/audio-light/slider-base.css
$HOME/bin/min $skins/audio-light/slider-base.css
mv slider-base-min.css $skins/audio-light/slider.css
cp $skins/audio-light/slider.css $skins/audio-light/slider-base.css
