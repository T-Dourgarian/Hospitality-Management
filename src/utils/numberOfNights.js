const numberOfNights = (date1, date2) => {
    let start = new Date(date1);
    let end = new Date(date2);
    let timeDiff = Math.abs(end.getTime() - start.getTime());
    let numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

    return numberOfNights == 0 ? 1 : numberOfNights


}

export default numberOfNights;