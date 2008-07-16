<div id="delicious-badge">
   <p><a href="http://del.icio.us/post?url=<?php echo ($sDeliciousUrl); ?>" class="bookmark">bookmark on del.icio.us</a></p>
   <?php if (count($oDeliciousStats->tag_cloud)) { ?>
   <div>
      <span>tags:</span>
      <ul>
         <?php foreach ($oDeliciousStats->tag_cloud as $sName => $iSize) { ?>
            <li><a href="http://del.icio.us/tag/<?php echo ($sName); ?>" class="tag-size-<?php echo ($iSize); ?>"><?php echo($sName); ?></a><!--(<?php echo ($oDeliciousStats->top_tags->$sName); ?>)--></li>
         <?php } ?>
      </ul>
   </div>
   <?php } ?>
   <?php if ($oDeliciousStats->total_posts) { ?>
      <p><a href="http://del.icio.us/url/<?php echo ($oDeliciousStats->hash); ?>" class="saved-by">saved by <span><?php echo ($oDeliciousStats->total_posts); ?></span> <?php if ($oDeliciousStats->total_posts == 1) { ?>person<?php } else { ?> people<?php } ?></a></p>
   <?php } else { ?>
      <p class="be-first">be the first to bookmark this page!</a></p>
   <?php } ?>
</div>