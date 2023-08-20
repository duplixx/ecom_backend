"use strict";

/**
 * profile controller
 */
const { createCoreController } = require("@strapi/strapi").factories;
const { parseMultipartData, sanitize } = require("@strapi/utils");
module.exports = createCoreController("api::profile.profile", ({ strapi }) => ({
  async createMe(ctx) {
    //get authanticated user details
    const user = ctx.state.user;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      country,
      zipCode,
      aboutMe,
      profileImage ,
    } = ctx.request.body;
    //check if user already has a profile
    const profile = await strapi
      .query("api::profile.profile")
      .findOne({ user: user.id });
    if (!user) {
      return ctx.request(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }
    //create profile
    const entity = await strapi.service("api::profile.profile").create({
      data: {
        firstName,
        lastName,
        email : user.email,
        phone,
        address,
        city,
        state,
        country,
        zipCode,
        aboutMe,
        profileImage,
        publishedAt: new Date(),
        user: user.id,
      },
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, {
      model: strapi.query("api::profile.profile").model,
    });
    return this.transformResponse(sanitizedEntity);
  },
  async findMe(ctx) {
    // Get the user from the authorization header
    // console.log(ctx.state.user);
    const user = ctx.state.user;

    // If the user is not authenticated, return an error
    if (!user) {
      return ctx.request(null, [
        {
          messages: [{ id: "No authorization header was found" }],
        },
      ]);
    }
    const entity = await strapi.query("api::profile.profile").findOne({
      where: {
        user: user.id,
      },
    });
    console.log(entity);

    // Sanitize the entity
    const sanitizedEntity = await this.sanitizeOutput(entity, {
      model: strapi.query("api::profile.profile").model,
    });

    // Return the profile
    return this.transformResponse(sanitizedEntity);
  },
  async updateMe(ctx) {
    // Get the user from the authorization header
    const user = ctx.state.user;
  
    // If the user is not authenticated, return an error
    if (!user) {
      return ctx.request(null, [
        {
          messages: [{ id: "No authorization header was found" }],
        },
      ]);
    }
  
    // Get the updated profile data from the request payload
    const updatedProfile = ctx.request.body;
  
    // Update the user's profile
    const updatedUser = await strapi.query("api::profile.profile").update({
      where : {
          email: user.email,
      },
      data: updatedProfile,
    });
  
    // Return the updated user
    return this.transformResponse(updatedUser);
  }
}));
