/**
 * ��һЩ���õķ����ͺ��� nameSpace ����ģʽ
 */
var utils = {
    listToArray :  function (likeArray){
        try{
            return Array.prototype.slice.call(likeArray,0);
        }catch (e){
            var ary = [];
            for(var i=0; i<likeArray.length; i++){
                ary[ary.length] = likeArray[i];
            }
            return ary;
        }
    },
    jsonParse : function (jsonStr){
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("("+jsonStr+")");
    }


}

