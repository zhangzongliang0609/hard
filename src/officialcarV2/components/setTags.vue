<template>
    <div class="tag-box">
        <ul class="selected-box">
            <li class="tag-item pt-5" v-for="tag in selected">
                <span title="{{tag.name}}">
                    {{tag.name}}
                </span>
                <i class="tag_delete" @click="deleteTag(tag.id)">x</i>
            </li>
        </ul>
        <ul class="select-tags-box">
            <li class="tag-item" v-for="item in tags" @click="selectTag(item)">
                <span title="{{item.name}}">
                    {{item.name}}
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
  export default {
      ready:function () {
          if(this.maxh){
              $('.selected-box,.select-tags-box').css({
                  maxHeight:this.maxh,
              })
          }
      },
      props:['selected','tags',"maxh"],
    data:function () {
      return{

      }
    },
    methods:{
        selectTag:function(item){
            if(this.selected.length > 0 ){
                for (let i = 0,len = this.selected.length; i < len; i++) {
                    if(item.id == this.selected[i].id){
                        return
                    }else if(len - 1 == i){
                        this.selected.push(item);
                    }
                }
            }else{
                this.selected.push(item);
            }

        },
        deleteTag:function(id){
            for (let i = 0,len = this.selected.length; i < len; i++) {
                if(id == this.selected[i].id){
                    this.selected.splice(i,1)
                    return
                }
            }
        }
    },
    components:{

    },
    filters:{

    },
  }
</script>


<style scoped lang="less" rel="stylesheet/less">
    .tag-box{
        display: inline-block;
        width: 100%;
        .selected-box,.select-tags-box{
            width: 100%;
            display: inline-block;
            min-height: 37px;
            border-radius: 5px;
            border: 1px solid #ccc;
            background-color: #fff;
            padding: 5px 10px;
            padding-top: 0;
            box-sizing: border-box;
            max-height: 150px;
            overflow-y: auto;

        }
        .tag-item {
            position: relative;
            text-align: center;
            float: left;
            width: 28%;
            color: #eee;
            font-size: 14px;
            line-height: 25px;
            margin-left: 5px;
            margin-top: 5px;
            border-radius: 5px;
            background-color: #ff9542;
            cursor: pointer;
            box-sizing: border-box;
            padding: 0 5px;
            height: 25px;
            span {
                width: 100%;
                height: 100%;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .tag_delete {
            position: absolute;
            width: 16px;
            height: 16px;
            text-align: center;
            line-height: 12px;
            font-size: 12px;
            border-radius: 50%;
            background-color: #000;
            color: #fff;
            top: -5px;
            right: -5px;
            cursor: pointer;
        }
    }


</style>
