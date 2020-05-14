const nullFilter = (adminData) => {
    admin = adminData.data.filter(function (x) { return x !== null });
    const obj = {
        index: adminData.index,
        data: admin
    }
    const json = JSON.stringify(obj);
    return json;
}
module.exports = nullFilter;