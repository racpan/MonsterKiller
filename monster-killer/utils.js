function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
function chooseItemFromArray(array) {
    var max = array.length;
    // return array[Math.floor(Math.random() * Math.floor(max))];
    return array[Math.floor(getRandom(0, max))];
}
function nameGenerator(armorIndex, nameList) {
    var name = [];
    var nameLength = Math.floor(getRandom(3,10));
    var alphabet = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(",");
    var vowels = 'a,e,i,o,u,y'.split(",");
    var prev = undefined;
    for (i=1; i<nameLength;i++) {  
        if (prev) {
            if (vowels.indexOf(prev) == -1) {
                prev = chooseItemFromArray(vowels);
                name.push(prev);
                continue
            } else {
                prev = chooseItemFromArray(alphabet);
                name.push(prev);
            }
        } else {
            prev = chooseItemFromArray(alphabet);
            name.push(prev);
        }    
    }
    return nameList[armorIndex] + ' ' + name.join('');
}



module.exports = {
    getRandom,
    chooseItemFromArray,
    nameGenerator
};