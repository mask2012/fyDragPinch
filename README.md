# fyDragPinch
让一个元素可拖拽、缩放、旋转

##依赖
依赖Event.min.js  它会给出所有事件的反馈，便于后续操作，event.drag-pinch-1.0.js是让元素拖拽，缩放，旋转的插件
```
<script src="js/Event.min.js"></script>
<script src="js/Event.drag-pinch-1.0.js"></script>
```



##调用示例
```
var dragPinchHandle=$('#upload-img').dragPinch();


$('#btn-start-test')[0].addEventListener('click', function(){
  dragPinchHandle.stop();
  $.util.alert('拖拽缩放停止')
});

$('#btn-start-test2')[0].addEventListener('click', function(){
  dragPinchHandle.restart();
  $.util.alert('拖拽缩放开始')
});


```
