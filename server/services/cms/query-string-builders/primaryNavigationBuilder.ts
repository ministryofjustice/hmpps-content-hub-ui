import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const buildPrimaryNavigationQueryString = () =>
  new DrupalJsonApiParams().addFields('menu_link_content--menu_link_content', ['title', 'url']).getQueryString()

export default buildPrimaryNavigationQueryString
