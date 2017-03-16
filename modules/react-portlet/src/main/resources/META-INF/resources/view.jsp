<%@ include file="/init.jsp" %>

<div id="<portlet:namespace />wrapper">
  Loading react application ...
</div>

<script>
window.process = { env: {} };
System.import('react-jsx-module/1.0.0').then(function (MyModule) {
    MyModule.render({name: 'Marco'}, '<portlet:namespace />wrapper');
});
</script>