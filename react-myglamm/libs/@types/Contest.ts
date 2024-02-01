export interface IContest {
    id:string;
    country:string;
    statusId:1 | 2 | 0;
    vendorCode:string;
    contestName:string;
    contestUrl:string;
    contestDescription:string;
    startTime:Date;
    endTime:Date;
    titleEnabled:number;
    descriptionEnabled:number;
    identifier:string;
    voteEnabled:number;
    imageCount:number;
    minimumImageCount:number;
    socialShareMessage:string;
    participantsNameEnabled:string;
    participantsPhoneEnabled:string;
    videoLinkEnabled:number;
    cityEnabled:number;
    meta:IContestMeta;
    questionText:string;
    updatedAt:Date;
    createdAt:Date;
    languages:string[];
    bannerImage:string;
}

export interface IContestMeta {
    migrationId:   number;
    migrationType: string;
    orignalObject: string;
}

export interface IContestRelationalData {
    contestUrl: string;
    bannerImage: string;
    voteEnabled: boolean;
    socialShareMessage: string;
    contestName: string;
    contestDescription: string;
    statusId:boolean;
}

export interface IContestData{
    id: string;
    country : string;
    statusId:1 | 2 | 0;
    createdAt : string;
    updatedAt : string;
    vendorCode : string;
    contestId : string;
    identifier : string;
    title:string;
    image : string[];
    videoLink:string;
    participantsName : string;
    babysDob : string;
    name : string;
    description1:string;
    description2:string;
    voteCount:number;
    email : string;
    languages : string[];
}

