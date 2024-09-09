sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, JSONModel, Fragment, formatter, Filter, FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("project9.controller.View1", {
        formatter: formatter,

        onInit: function () {
            var Data = {
                Emp: [
                    { name: "sudheer", age: 23, mail: "sudheer@gmail.com" },
                    { name: "sunny", age: 17, mail: "sunny@gmail.com" },
                    { name: "vanitha", age: 22, mail: "vani@gmail.com" },
                    { name: "sravs", age: 24, mail: "sravanthi@gmail.com" }
                ]
            };
            var oModel = new JSONModel(Data);
            this.getView().setModel(oModel, "model");
            this.mDialogs = {};
        },

        onOpenFrag: function (FragPath) {
            var oDialog = this.mDialogs[FragPath];
            if (!oDialog) {
                return Fragment.load({
                    id: this.getView().getId(),
                    name: FragPath,
                    controller: this
                }).then(function (oFrag) {
                    this.getView().addDependent(oFrag);
                    this.mDialogs[FragPath] = oFrag;
                    return oFrag;
                }.bind(this)); // Ensure correct context for 'this'
            } else {
                return Promise.resolve(oDialog); // Return a resolved promise if dialog is already loaded
            }
        },

        onCloseFrag: function (oFragId) {
            var oDialog = this.getView().byId(oFragId);
            if (oDialog) {
                oDialog.close();
            }
        },

        onValueHelp: function () {
            this.onOpenFrag("project9.fragments.show").then(function (oFrag) {
                oFrag.open();
            }.bind(this));
        },

        onClose: function () {
            this.onCloseFrag("idFragmentDialog");
        },

        onSearch: function (oEvent) {
            var query = oEvent.getParameter('query');
            var filter = new Filter({
                filters: [
                    new Filter("name", FilterOperator.Contains, query),
                    new Filter("mail", FilterOperator.Contains, query)
                ],
                and: true
            });
            var table = this.getView().byId("table1");
            var binding = table.getBinding("items");
            binding.filter(filter);
        },

        handleSortButtonPressed: function () {
            this.onOpenFrag("project9.fragments.sort").then(function (oFrag) {
                oFrag.open();
            }.bind(this));
        },

        handleSortDialogConfirm: function (oEvent) {
            var mParams = oEvent.getParameters();
            var oTable = this.byId("table1");
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
            var sPath = mParams.sortItem.getKey();
            var bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));
            oBinding.sort(aSorters);
        }
    });
});
